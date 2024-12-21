import {MovieRecommendationsForTitle} from "../models/movie.recommendations.for.title";
import {Movie} from "../models/movie";

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export function mapRecommendedMoviesResponse(data: MovieRecommendationsForTitle[]): MovieRecommendationsForTitle[] {
  return data.map(response => ({
    ...response,
    recommendedMovies: response.recommendedMovies.map(movie => ({
      ...movie,
      poster_path: `${POSTER_BASE_URL}${movie.poster_path}`,
    })),
  }));
}

export function mapMovie(data: Movie): Movie {
  return {
    id: data.id,
    title: data.title,
    overview: data.overview,
    poster_path: `${POSTER_BASE_URL}${data.poster_path}`,
    vote_average: data.vote_average,
    production_companies: data.production_companies,
    popularity: data.popularity,
    vote_count: data.vote_count,
    runtime: data.runtime,
    budget: data.budget
  };
}

export function mapMovies(data: Movie[]): Movie[] {
  return data.map(movie => mapMovie(movie));
}
