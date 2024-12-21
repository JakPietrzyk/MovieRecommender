from crypt import methods

from flask import request, jsonify, Blueprint
from sqlalchemy.util.langhelpers import repr_tuple_names

from services.movie_service import MovieService

movie_routes = Blueprint('movie_routes', __name__)
movie_service = MovieService()

@movie_routes.route('/recommend_movies_for_ids_with_filters', methods=['POST'])
def recommend_movies_with_filters():
    data = request.json
    movie_ids = data.get('movieIds')
    movie_filters = data.get('filters')

    recommended_movies = movie_service.recommend_movies_for_movie_ids_with_filters(movie_ids, movie_filters)
    return jsonify(recommended_movies)

@movie_routes.route('/recommend_movies_for_ids', methods=['POST'])
def recommend_movies():
    data = request.json
    movie_ids = data.get('movieIds')
    genre = data.get('genre', None)
    no_movies = int(data.get('no_movies', 15))

    recommended_movies = movie_service.recommend_movies_for_movie_ids(movie_ids, genre, no_movies)
    recommended_movies_dict = [movie.to_dict() for movie in recommended_movies]

    return jsonify({'recommended_movies': recommended_movies_dict})

@movie_routes.route('/suggestions', methods=['GET'])
def get_movie_titles_suggestions():
    title_input = request.args.get('titleInput', '').strip()
    suggestions = movie_service.get_movie_titles_suggestions(title_input)
    return jsonify(suggestions)

@movie_routes.route('/movies/genres', methods=['GET'])
def get_movie_genres():
    genres = movie_service.get_movie_genres()
    return jsonify(genres)

@movie_routes.route('/movies/filtered', methods=['POST'])
def get_movies_filtered():
    data = request.json
    filtered_movies = movie_service.get_movies_filtered(data)
    return jsonify(filtered_movies)

@movie_routes.route('/movies/<int:movie_id>', methods=['GET'])
def get_movie_details_by_id(movie_id):
    movie_details = movie_service.get_movie_details(movie_id)

    return jsonify(movie_details.to_dict())

@movie_routes.route('/movies/search', methods=['GET'])
def search_movie_by_title():
    movie_title = request.args.get('title')
    movie = movie_service.get_closest_movie_for_title(movie_title)
    if not movie_title:
        return jsonify({"error": "Title parameter is missing"}), 400

    if movie:
        return jsonify(movie.to_dict()), 200
    else:
        return jsonify({"error": "Movie not found"}), 404

