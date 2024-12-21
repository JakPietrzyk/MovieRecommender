from flask_config import db


class Movie(db.Model):
    __tablename__ = 'movies'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False, index=True)
    genres = db.Column(db.String, index=True)
    release_date = db.Column(db.String, index=True)
    rating = db.Column(db.Float, index=True)
    production_companies = db.Column(db.String)
    popularity = db.Column(db.Float)
    vote_average = db.Column(db.Float)
    vote_count = db.Column(db.Integer)
    budget = db.Column(db.Float)
    overview = db.Column(db.String)
    runtime = db.Column(db.Integer)
    poster_path = db.Column(db.String)


    similarities = db.relationship(
        "Similarity",
        primaryjoin="Movie.id == Similarity.movie_id",
        back_populates="movie"
    )

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'genres': self.genres,
            'release_date': self.release_date,
            'rating': self.rating,
            'production_companies': self.production_companies,
            'popularity': self.popularity,
            'vote_average': self.vote_average,
            'vote_count': self.vote_count,
            'budget': self.budget,
            'overview': self.overview,
            'runtime': self.runtime,
            'poster_path': self.poster_path
        }

class Similarity(db.Model):
    __tablename__ = 'similarities'
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), index=True)
    similar_movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), index=True)
    score = db.Column(db.Float)

    movie = db.relationship(
        "Movie",
        foreign_keys=[movie_id],
        back_populates="similarities"
    )
    similar_movie = db.relationship(
        "Movie",
        foreign_keys=[similar_movie_id]
    )

    def to_dict(self):
        return {
            'id': self.id,
            'movie_id': self.movie_id,
            'similar_movie_id': self.similar_movie_id,
            'score': self.score
        }