// movie.path.mapper.spec.ts
import { mapRecommendedMoviesResponse, mapMovies } from './movie.path.mapper';
import { MovieRecommendationsForTitle } from '../models/movie.recommendations.for.title';
import { Movie } from '../models/movie';

describe('Movie Path Mapper', () => {
  describe('mapRecommendedMoviesResponse', () => {
    it('should map recommended movies correctly', () => {
      const input: MovieRecommendationsForTitle[] = [
        {
          movieTitle: 'Some Movie',
          recommendedMovies: [
            { id: 1, title: 'Movie 1', overview: 'Overview 1', poster_path: '/path/to/poster1.jpg' },
            { id: 2, title: 'Movie 2', overview: 'Overview 2', poster_path: '/path/to/poster2.jpg' }
          ]
        }
      ];

      const expectedOutput = [
        {
          movieTitle: 'Some Movie',
          recommendedMovies: [
            { id: 1, title: 'Movie 1', overview: 'Overview 1', poster_path: 'https://image.tmdb.org/t/p/w500/path/to/poster1.jpg' },
            { id: 2, title: 'Movie 2', overview: 'Overview 2', poster_path: 'https://image.tmdb.org/t/p/w500/path/to/poster2.jpg' }
          ]
        }
      ];

      const result = mapRecommendedMoviesResponse(input);
      expect(result).toEqual(expectedOutput);
    });
  });

  describe('mapMovies', () => {
    it('should map movies correctly', () => {
      const input: Movie[] = [
        { id: 1, title: 'Movie 1', overview: 'Overview 1', poster_path: '/path/to/poster1.jpg' },
        { id: 2, title: 'Movie 2', overview: 'Overview 2', poster_path: '/path/to/poster2.jpg' }
      ];

      const expectedOutput = [
        { id: 1, title: 'Movie 1', overview: 'Overview 1', poster_path: 'https://image.tmdb.org/t/p/w500/path/to/poster1.jpg' },
        { id: 2, title: 'Movie 2', overview: 'Overview 2', poster_path: 'https://image.tmdb.org/t/p/w500/path/to/poster2.jpg' }
      ];

      const result = mapMovies(input);
      expect(result).toEqual(expectedOutput);
    });
  });
});
