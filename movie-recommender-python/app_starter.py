from controllers.movie_controller import movie_routes
from data.data_loader import setup_database
from flask_config import app


if __name__ == '__main__':
    setup_database()
    app.register_blueprint(movie_routes)
    app.run(host='0.0.0.0', port=5000, debug=True)