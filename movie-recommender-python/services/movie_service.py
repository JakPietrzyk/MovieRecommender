from flask_config import db
from models.database.models import Movie, Similarity
from models.movies_filters import MoviesFilter
import random

class MovieService:
    def recommend_movies_for_movie_ids_with_filters(self, movie_ids, movie_filters):
        no_movies = 15
        movie_filters = MoviesFilter(
            movie_title=movie_filters.get('movieTitle', ''),
            genre=movie_filters.get('genre', ''),
            release_date=movie_filters.get('releaseDate', 0),
            rating=movie_filters.get('rating', 0.0),
            last_recommendations=movie_filters.get('lastRecommendations', [])
        )

        base_count = no_movies // len(movie_ids)
        remainder = no_movies % len(movie_ids)

        distribution = [base_count + 1 if i < remainder else base_count for i in range(len(movie_ids))]

        already_recommended_movies = set()
        for i, movie_id in enumerate(movie_ids):
            recommended_movies_for_movie = self.__get_similar_movies_filtered_for_movie(
                movie_id, movie_filters, already_recommended_movies, distribution[i]
            )
            already_recommended_movies.update(recommended_movies_for_movie)


        return list(already_recommended_movies)

    def __get_similar_movies_filtered_for_movie(self, movie_id, filters, already_recommended_movies, no_movies):
        similar_movies = {}
        last_recommendations_from_filter = set(movie['title'] for movie in filters.last_recommendations)
        movie_similarities_for_movie = db.session.query(
            Similarity.similar_movie_id,
            Similarity.score
        ).filter(Similarity.movie_id == movie_id).all()

        for similar_movie_id, similarity_score in movie_similarities_for_movie:
            movie_data = (db.session.query(Movie.title, Movie.genres, Movie.release_date, Movie.rating)
                          .filter(
                                Movie.id == similar_movie_id,
                                Movie.title.notin_(already_recommended_movies),
                                Movie.title.notin_(last_recommendations_from_filter),
                                Movie.genres.contains(filters.genre),
                                Movie.release_date >= str(filters.release_date),
                                Movie.rating >= filters.rating
                          )
                          .first())
            if movie_data:
                title, _, _, _ = movie_data
                if similar_movie_id not in similar_movies:
                    similar_movies[similar_movie_id] = {'title': title, 'score': 0}
                similar_movies[similar_movie_id]['score'] += similarity_score

        similar_movies_sorted = sorted(similar_movies.items(), key=lambda x: x[1]['score'], reverse=True)


        recommended_movies = [movie['title'] for idx, movie in similar_movies_sorted if idx != movie_id][:no_movies]

        if len(recommended_movies) < no_movies:
            additional_movies = db.session.query(Movie.title).filter(
                Movie.title.notin_(last_recommendations_from_filter),
                Movie.title.notin_(already_recommended_movies)
            )

            if filters.genre:
                additional_movies = additional_movies.filter(Movie.genres.contains(filters.genre))

            if filters.release_date:
                additional_movies = additional_movies.filter(Movie.release_date >= str(filters.release_date))

            if filters.rating:
                additional_movies = additional_movies.filter(Movie.rating >= filters.rating)

            additional_movies = additional_movies.all()

            needed_count = no_movies - len(recommended_movies)
            additional_selection = random.sample([movie.title for movie in additional_movies],
                                                 min(needed_count, len(additional_movies)))

            recommended_movies.extend(additional_selection)

        return recommended_movies

    def recommend_movies_for_movie_ids(self, movie_ids, genre_filter, no_movies=15):
        base_count = no_movies // len(movie_ids)
        remainder = no_movies % len(movie_ids)

        distribution = [base_count + 1 if i < remainder else base_count for i in range(len(movie_ids))]

        all_recommendations = []
        unique_titles = set()

        for i, movie_id in enumerate(movie_ids):
            recommendations = self.__get_unique_recommendations_for_movie(
                movie_id, distribution[i], unique_titles, all_recommendations, genre_filter
            )
            all_recommendations.extend(recommendations)

        random.shuffle(all_recommendations)
        return all_recommendations[:no_movies]

    def __get_unique_recommendations_for_movie(self, movie_id, no_movies, unique_titles, already_recommended,
                                               genre_filter=None, min_score=0.0):
        already_recommended_titles = [movie.title if isinstance(movie, Movie) else movie for movie in
                                      already_recommended]

        query = (db.session
        .query(Similarity.similar_movie_id,
               db.func.sum(Similarity.score).label('total_score'))
        .join(Movie, Movie.id == Similarity.similar_movie_id)
        .filter(
            Similarity.movie_id == movie_id,
            Movie.title.notin_(already_recommended_titles)  # Use only titles here
        ))

        if genre_filter:
            query = query.filter(Movie.genres.contains(genre_filter.lower()))

        query = (query
                 .filter(Similarity.score >= min_score)
                 .group_by(Similarity.similar_movie_id)
                 .order_by(db.desc('total_score'))
                 .limit(no_movies * 2))

        recommendations = []
        for similar_movie_id, _ in query:
            movie = db.session.query(Movie).filter(Movie.id == similar_movie_id).first()
            if movie and movie.title not in unique_titles:
                unique_titles.add(movie.title)
                recommendations.append(movie)
                if len(recommendations) >= no_movies:
                    break

        if len(recommendations) < no_movies:
            print("Not enough movies, recommending more")
            additional_movies_query = db.session.query(Movie).filter(
                Movie.title.notin_(already_recommended_titles)
            )

            if genre_filter:
                additional_movies_query = additional_movies_query.filter(Movie.genres.contains(genre_filter.lower()))

            additional_movies = additional_movies_query.all()

            needed_count = no_movies - len(recommendations)
            additional_selection = random.sample(additional_movies, min(needed_count, len(additional_movies)))
            recommendations.extend(additional_selection)

        return recommendations

    def get_movie_titles_suggestions(self, title_input):
        if not title_input:
            return []

        movie_titles = Movie.query.filter(Movie.title.ilike(f"%{title_input}%")).limit(5).all()
        return [movie.title for movie in movie_titles]

    def get_movie_genres(self):
        genres = db.session.query(Movie.genres).distinct().all()
        unique_genres = sorted(set(genre.lower() for sublist in genres for genre in sublist[0].split(',')))
        return unique_genres

    def get_movies_filtered(self, data):
        query = db.session.query(Movie)
        if data.get('movieTitle'):
            query = query.filter(Movie.title.ilike(f"%{data['movieTitle']}%"))
        if data.get('genre'):
            query = query.filter(Movie.genres.contains(data['genre']))
        if data.get('releaseDate'):
            query = query.filter(Movie.release_date >= str(data['releaseDate']))
        if data.get('rating'):
            query = query.filter(Movie.rating >= data['rating'])

        filtered_movies = query.all()
        return [
            {"title": movie.title, "genres": movie.genres, "release_date": movie.release_date, "rating": movie.rating}
            for movie in filtered_movies
        ]

    def get_movie_details(self, movie_id):
        query = db.session.query(Movie).filter(Movie.id == movie_id)
        movie_details = query.first()

        return movie_details

    def get_closest_movie_for_title(self, movie_title):
        movie = Movie.query.filter(Movie.title.ilike(f"%{movie_title}%")).first()

        return movie
