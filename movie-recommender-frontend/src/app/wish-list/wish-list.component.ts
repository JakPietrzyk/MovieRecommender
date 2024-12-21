import {Component, OnInit} from '@angular/core';
import { WishListService } from '../services/wishList.service';
import { Movie } from '../models/movie';
import { AuthorizationService } from '../services/authorization.service';
import { CommonModule } from '@angular/common';
import {MovieModalService} from "../services/movie.modal.service";

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.scss'
})
export class WishListComponent implements OnInit{
  movies: Movie[] = [];
  selectedMovie?: Movie;

  constructor(private wishListService: WishListService,
              private authorizationService: AuthorizationService,
              protected movieModalService : MovieModalService
    ) { }

  ngOnInit(): void {
    this.loadWishList();
  }

  loadWishList(): void {
    const currentUser = this.authorizationService.getCurrentUser();

    if (!currentUser) {
      console.error('User not logged in');
      return;
    }

    this.wishListService.getWishList(currentUser)
      .subscribe({
        next: (data) => {
          this.movies = data.map(movie => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`}))
        },
        error: (err) => {
          console.error('Error fetching wishlist', err);
        }
      });
  }
}
