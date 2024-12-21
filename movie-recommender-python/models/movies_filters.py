from typing import List
from models.movie_response import Movie

class MoviesFilter:
    def __init__(self, movie_title: str = '', genre: str = '', release_date: int = 0, rating: float = 0.0, last_recommendations: List[Movie] = None):
        if last_recommendations is None:
            last_recommendations = []
        self.last_recommendations = last_recommendations
        self.movie_title = movie_title
        self.genre = genre
        self.release_date = release_date
        self.rating = rating
