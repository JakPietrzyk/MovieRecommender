class Movie:
    def __init__(self, id: int, title: str, overview: str, poster_path: str):
        self.id = id
        self.title = title
        self.overview = overview
        self.poster_path = poster_path

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'overview': self.overview,
            'poster_path': self.poster_path
        }
