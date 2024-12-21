import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map, Observable, of, switchMap} from 'rxjs';
import { Movie } from '../models/movie';
import { ApiResponse } from '../models/api.response';
import {AuthorizationService} from "./authorization.service";
import {User} from "../models/user.model";
import {MovieRecommendationsForTitle} from "../models/movie.recommendations.for.title";
import {MoviesFilter} from "../models/movies.filter";

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:8080/api/';

  constructor(private http: HttpClient,
              private authorizationService: AuthorizationService
  ) { }

  getRecommendedMovies(): Observable<Movie[]> {
    const user = this.authorizationService.getCurrentUser() as User;
    if(!user) {
      return of([])
    }

    return this.http.get<Movie[]>(this.apiUrl + 'movies/users/' + user.id + '/recommended');
  }

  getMovieById(movieId: number): Observable<Movie> {
    return this.http.get<Movie | ApiResponse>(`${this.apiUrl}movies/${movieId}`).pipe(
      map((data) => {
        if ('id' in data) {
          return data as Movie;
        } else {
          throw new Error('Failed to fetch movie ${(data as ApiResponse)?.message}');
        }
      }),
      catchError((err) => {
        console.error('Error fetching movie by ID:', err);
        throw err;
      })
    );
  }

  getMoviesByIds(movieIds: number[]): Observable<Movie[]> {
    return this.http.post<Movie[] | ApiResponse>(`${this.apiUrl}movies`, movieIds).pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data as Movie[];
        } else {
          throw new Error(`Failed to fetch movies ${(data as ApiResponse)?.message}`);
        }
      }),
      catchError((err) => {
        console.log('Error fetching movies by IDs:', err);
        throw err;
      })
    );
  }

  getRecommendedMoviesForEachMovieInUserWishList(numberOfMoviesToRecommend: number): Observable<MovieRecommendationsForTitle[]> {
    const user = this.authorizationService.getCurrentUser() as User;
    if(!user) {
      return of([])
    }

    const url = `${this.apiUrl}movies/users/${user.id}/wishList/recommend/${numberOfMoviesToRecommend}`;

    return this.http.get<MovieRecommendationsForTitle[]>(url);
  }

  getRecommendedMoviesForEachGenre(numberOfMoviesToRecommend: number): Observable<MovieRecommendationsForTitle[]> {
    const user = this.authorizationService.getCurrentUser() as User;
    if(!user) {
      return of([])
    }

    const url = `${this.apiUrl}movies/users/${user.id}/wishList/recommend/${numberOfMoviesToRecommend}/genre`;

    return this.http.get<MovieRecommendationsForTitle[]>(url);
  }


  getRecommendedMoviesForMovie(movieId: number): Observable<Movie[]>{
    const url = `${this.apiUrl}movies/recommend/${movieId}`;

    return this.http.get<Movie[]>(url);
  }

  getMovieTitleSuggestions(movieTitleInput: string): Observable<string[]>{
    const url = `http://127.0.0.1:5000/suggestions?titleInput=${movieTitleInput}`

    return this.http.get<string[]>(url);
  }

  getMovieForMovieTitle(movieTitle: string): Observable<Movie>{
    const url = `${this.apiUrl}movies/suggestions`

    return this.http.post<Movie>(url, movieTitle);
  }

  getAllMoviesGenres(): Observable<string[]> {
    const url = `http://127.0.0.1:5000/movies/genres`

    return this.http.get<string[]>(url);
  }

  findAllMoviesForFilters(moviesFilter: MoviesFilter): Observable<Movie[]> {
    const urlFiltered = `http://127.0.0.1:5000/movies/filtered`;
    const urlApi = `${this.apiUrl}movies/data`;

    return this.http.post<Movie[]>(urlFiltered, moviesFilter).pipe(
      switchMap((filteredMovies) => {
        return this.http.post<Movie[]>(urlApi, filteredMovies.map((movie)=>movie.title));
      })
    );
  }

  getRecommendedMoviesForFilters(movieFilters: MoviesFilter): Observable<Movie[]> {
    const user = this.authorizationService.getCurrentUser() as User;
    if(!user) {
      return of([])
    }

    return this.http.post<Movie[]>(this.apiUrl + 'movies/users/' + user.id + '/recommended', movieFilters);
  }
}
