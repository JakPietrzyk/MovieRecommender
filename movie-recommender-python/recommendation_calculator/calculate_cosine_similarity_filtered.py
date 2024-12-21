import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import numpy as np
from tqdm import tqdm
import os

# Wczytanie datasetu
df = pd.read_csv('./TMDB_movie_dataset_v11.csv')

# Usunięcie zbędnych kolumn
df = df[['title', 'vote_average', 'overview', 'genres', 'keywords', 'budget', 'vote_count', 'runtime', 'popularity', 'status', 'release_date', 'production_companies', 'poster_path']]

# Usunięcie filmów z tytułem NaN i duplikatów na podstawie tytułu
df = df.dropna(subset=['title']).drop_duplicates(subset=['title']).reset_index(drop=True)

# Zastąpienie brakujących wartości w kolumnach 'genres' i 'keywords'
df['genres'] = df['genres'].fillna('unknown')
df['keywords'] = df['keywords'].fillna('')
df['production_companies'] = df['production_companies'].fillna('')

def preprocess_text(text):
    if isinstance(text, str):
        return ' '.join(text.split()).lower()
    return ''

df['overview'] = df['overview'].apply(preprocess_text)
df['genres'] = df['genres'].apply(preprocess_text)
df['keywords'] = df['keywords'].apply(preprocess_text)
df['production_companies'] = df['production_companies'].apply(preprocess_text)

# Łączenie przetworzonych kolumn w jedną kolumnę tekstową
df['combined'] = df['genres'] + ' ' + df['keywords'] + ' ' + df['production_companies'] #df['overview'] + ' ' +

min_vote_count = 100  # Filtr minimalnej liczby głosów
min_vote_average = 3.0  # Filtr minimalnej oceny
budget_threshold = df['budget'].quantile(0.7)  # Budżet w top 30%

filtered_df = df[
    ~(
        (df['status'] != 'Released') |
        (df['vote_count'] < min_vote_count) |
        (df['vote_average'] < min_vote_average) |
        (df['budget'] < budget_threshold) |
        (df['runtime'] < 30) |
        (df['keywords'] == '') |
        (df['genres'] == '') |
        (df['overview'] == '')
    )
].reset_index(drop=True)
filtered_df.to_csv("small_csv_movies.csv")

# Wektoryzacja tekstu przy użyciu TF-IDF dla obu baz
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf_vectorizer.fit_transform(filtered_df['combined'])  # Duża baza
filtered_tfidf_matrix = tfidf_vectorizer.transform(filtered_df['combined'])  # Przefiltrowana baza

batch_size = 800
num_batches = int(np.ceil(tfidf_matrix.shape[0] / batch_size))

with tqdm(total=num_batches, desc="Processing batches", unit="batch") as pbar:
    for batch_idx in range(num_batches):
        start_idx = batch_idx * batch_size
        end_idx = min((batch_idx + 1) * batch_size, tfidf_matrix.shape[0])

        filename = f'top_similarities_batch_{batch_idx}.pkl'
        if os.path.exists(filename):
            print(f"Batch {batch_idx} już istnieje, pomijanie...")
            pbar.update(1)
            continue

        # Obliczanie podobieństwa
        cosine_sim_batch = cosine_similarity(tfidf_matrix[start_idx:end_idx], filtered_tfidf_matrix)

        # Zapisanie podobieństw
        top_similarities_batch = {}

        for i in range(end_idx - start_idx):
            similar_indices = cosine_sim_batch[i].argsort()[::-1][:1000]
            similar_scores = cosine_sim_batch[i][similar_indices]

            # Pobieranie tytułu i gatunków dla bieżącego filmu
            movie_title = df.iloc[start_idx + i]['title']
            movie_genres = df.iloc[start_idx + i]['genres']
            
            # Pobieranie tytułów i gatunków dla podobnych filmów
            similar_movies = []
            for j, score in zip(similar_indices, similar_scores):
                similar_movie_title = filtered_df.iloc[j]['title']
                similar_movie_genres = filtered_df.iloc[j]['genres']
                similar_movies.append({
                    'index': j,
                    'title': similar_movie_title,
                    'genres': similar_movie_genres,
                    'score': score
                })

            # Dodanie tytułu, gatunków, i podobieństw do zapisanych danych
            top_similarities_batch[start_idx + i] = {
                'title': movie_title,
                'genres': movie_genres,
                'similarities': similar_movies
            }

        # Zapisanie batcha do pliku
        with open(filename, 'wb') as f:
            pickle.dump(top_similarities_batch, f)

        pbar.update(1)

print("Wszystkie batch'e zostały zapisane.")
