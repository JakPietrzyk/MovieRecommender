import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../../models/user.model";
import {Movie} from "../../../models/movie";
import {Subscription} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthorizationService} from "../../../services/authorization.service";
import {WishListService} from "../../../services/wishList.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-wish-list-buttons',
  standalone: true,
  imports: [],
  templateUrl: './wish-list-buttons.component.html',
  styleUrl: './wish-list-buttons.component.scss'
})
export class WishListButtonsComponent implements OnInit, OnDestroy{
  private wishlistSubscription?: Subscription;
  isMovieInWishlist = false;
  @Input() selectedMovie: Movie | null = null;

  constructor(
    protected authorizationService: AuthorizationService,
    private wishListService: WishListService,
  ) {}

  ngOnInit() {
    this.checkIfMovieIsInWishlist();
  }

  private checkIfMovieIsInWishlist(): void {
    const currentUser = this.authorizationService.getCurrentUser();
    const selectedMovie = this.selectedMovie;

    if(currentUser === null || selectedMovie === null) {
      return;
    }

    this.wishlistSubscription = this.wishListService.checkMovieExistsInWishlist(currentUser as User, selectedMovie as Movie)
      .subscribe({
        next: (exists: boolean) => {
          this.isMovieInWishlist = exists;
        },
        error: (error) => {
          console.error('Error checking wishlist:', error);
        }
      });
  }

  addToWishlist(movie: Movie | null): void {
    if (movie === null) {
      console.error('No movie selected');
      return;
    }

    const currentUser = this.authorizationService.getCurrentUser();

    this.wishListService.addMovieToWishList(currentUser as User, movie as Movie)
      .subscribe({
        next: () => {
          this.isMovieInWishlist = true;
          console.log('Movie added to wishlist');
        },
        error: (err) => {
          console.error('Error adding movie to wishlist', err);
        }
      });
  }

  removeFromWishList(movie: Movie | null): void{
    if (movie === null) {
      console.error('No movie selected');
      return;
    }

    const currentUser = this.authorizationService.getCurrentUser();

    this.wishListService.removeFromWishList(currentUser as User, movie as Movie)
      .subscribe({
        next: () => {
          this.isMovieInWishlist = false;
          console.log('Movie removed from wishlist');
        },
        error: (err) => {
          console.error('Error removing movie from wishlist', err);
        }
      });
  }

  ngOnDestroy() {
    this.wishlistSubscription?.unsubscribe();
  }
}
