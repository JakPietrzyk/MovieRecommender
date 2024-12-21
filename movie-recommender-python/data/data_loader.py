import datetime
from xmlrpc.client import DateTime

import pandas as pd
import pickle
import time

from psycopg2 import DATETIME

from flask_config import db, app
from models.database.models import Movie, Similarity


def load_similarity_data():
    print("Starter loading recommendations into database")

    similarity_dir = 'data/movies_datasets'
    for i in range(20):
        filename = f'{similarity_dir}/top_similarities_batch_{i}.pkl'

        # Ponawianie próby wczytania danych
        attempts = 3
        while attempts > 0:
            try:
                with open(filename, 'rb') as file:
                    similarities = pickle.load(file)

                    for movie in similarities:
                        for similarity in similarities[movie]['similarities']:
                            movie_id = similarities[movie]['similarities'][0]['index']
                            similar_movie_id = similarity['index']
                            score = similarity['score']

                            if movie_id == similar_movie_id:
                                continue

                            similarityToAdd = Similarity(
                                movie_id=int(movie_id) + 1,
                                similar_movie_id=int(similar_movie_id) + 1,
                                score=float(score)
                            )
                            db.session.add(similarityToAdd)

                    db.session.commit()
                    print(f"Batch {i} loaded successfully")
                    break  # Jeśli operacja zakończyła się sukcesem, przerywamy pętlę
            except Exception as e:
                print(f"Error loading batch {i}, retrying... ({attempts} attempts left)")
                attempts -= 1
                time.sleep(5)  # Czekamy 5 sekund przed ponowną próbą
                if attempts == 0:
                    print(f"Failed to load batch {i} after 3 attempts: {e}")


def setup_database():
    with app.app_context():
        db.create_all()
        print("Database Initialization completed")

        if Movie.query.count() == 0:
            print("Starter loading movies into database")

            movies_df = pd.read_csv('data/movies_datasets/small_csv_movies.csv')

            # Ponawianie próby wstawienia filmów do bazy
            attempts = 3
            while attempts > 0:
                try:
                    for _, row in movies_df.iterrows():
                        production_companies = row.get('production_companies', '')
                        if pd.isna(production_companies):
                            production_companies = ''

                        movie = Movie(
                            title=row['title'],
                            genres=row['genres'],
                            release_date=row.get('release_date', None),
                            rating=row.get('vote_average', None),
                            production_companies=production_companies,
                            popularity=row.get('popularity', None),
                            vote_average=row.get('vote_average', None),
                            vote_count=row.get('vote_count', None),
                            budget=row.get('budget', None),
                            overview=row.get('overview', ''),
                            runtime=row.get('runtime', None),
                            poster_path=row.get('poster_path', '')
                        )
                        db.session.add(movie)
                    db.session.commit()
                    print("Movies loaded into the database")
                    break  # Jeśli operacja zakończyła się sukcesem, przerywamy pętlę
                except Exception as e:
                    print(f"Error loading movies, retrying... ({attempts} attempts left)")
                    attempts -= 1
                    time.sleep(5)  # Czekamy 5 sekund przed ponowną próbą
                    if attempts == 0:
                        print(f"Failed to load movies after 3 attempts: {e}")

        if Similarity.query.count() == 0:
            load_similarity_data()
