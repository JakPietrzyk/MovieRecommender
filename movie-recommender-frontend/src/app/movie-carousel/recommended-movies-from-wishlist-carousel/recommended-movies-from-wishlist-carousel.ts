import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { MovieService } from '../../services/movie.service';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { Movie } from '../../models/movie';
import { MovieDetailsModalComponent } from "../movie-details-modal/movie-details-modal.component";
import {MovieRecommendationsForTitle} from "../../models/movie.recommendations.for.title";
import {MovieCarouselComponent} from "../movie-carousel.component";
import {Subscription} from "rxjs";
import {mapRecommendedMoviesResponse} from "../../mappers/movie.path.mapper";

@Component({
  selector: 'app-recommended-movies-from-wishlist-carousel',
  standalone: true,
  imports: [CommonModule, MovieDetailsModalComponent, NgOptimizedImage, MovieCarouselComponent],
  templateUrl: './recommended-movies-from-wishlist-carousel.html',
  styleUrl: './recommended-movies-from-wishlist-carousel.scss'
})
export class RecommendedMoviesFromWishListCarouselComponent implements OnInit, OnDestroy{
  @Input() NUMBER_OF_MOVIES_CAROUSELS = 4;

  private subscription?: Subscription;

  movies: Movie[] = [];
  recommendedMoviesResponse: MovieRecommendationsForTitle[] = [];

  constructor(
    private movieService: MovieService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.movieService.getRecommendedMoviesForEachMovieInUserWishList(this.NUMBER_OF_MOVIES_CAROUSELS)
      .subscribe({
        next: (data) => {
          this.recommendedMoviesResponse = mapRecommendedMoviesResponse(data)
        },
        error: (err) => {
          console.error('Error fetching movies', err);
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
