import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, catchError, of, switchMap, map} from 'rxjs';
import { ApiResponse } from '../models/api.response';
import { User } from '../models/user.model';
import { Movie } from '../models/movie';
import { MovieService } from './movie.service';


@Injectable({
  providedIn: 'root'
})
export class WishListService {
  private apiUrl = 'http://localhost:8080/api/';
  constructor(private http: HttpClient,
              private movieService: MovieService
    ) { }

  addMovieToWishList(currentUser: User, movieToAdd: Movie): Observable<ApiResponse> {
      const url = `${this.apiUrl}wishList/user/${currentUser.id}/add/${movieToAdd.id}`;

      return this.http.post<ApiResponse>(url, {});
  }

  getWishList(currentUser: User): Observable<Movie[]> {
    return this.http.get<number[]>(`${this.apiUrl}wishList/user/${currentUser.id}`).pipe(
      switchMap(movieIds => this.movieService.getMoviesByIds(movieIds)),
      catchError(error => {
        console.error('Error fetching wishlist', error);
        return of([]);
      })
    );
  }

  removeFromWishList(currentUser: User, movieToAdd: Movie): Observable<ApiResponse> {
      const url = `${this.apiUrl}wishList/user/${currentUser.id}/remove/${movieToAdd.id}`;

      return this.http.post<ApiResponse>(url, {});
  }

   checkMovieExistsInWishlist(currentUser: User, movieToAdd: Movie): Observable<boolean> {
      const url = `${this.apiUrl}wishList/check/${currentUser.id}/${movieToAdd.id}`;

      return this.http.get<boolean>(url);
  }

  isWishListEmpty(currentUser: User): Observable<boolean> {
    return this.getWishList(currentUser).pipe(
      map(wishlist => wishlist.length === 0),
      catchError(() => {
        return of(true);
      })
    );
  }
}
