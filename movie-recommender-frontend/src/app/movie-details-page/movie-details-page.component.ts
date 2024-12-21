import {Component, OnDestroy, OnInit} from '@angular/core';
import {Movie} from "../models/movie";
import {ActivatedRoute} from "@angular/router";
import {MovieService} from "../services/movie.service";
import {mapMovie, mapMovies} from "../mappers/movie.path.mapper";
import {MovieCarouselComponent} from "../movie-carousel/movie-carousel.component";
import {Subscription} from "rxjs";
import {
  WishListButtonsComponent
} from "../movie-carousel/movie-details-modal/wish-list-buttons/wish-list-buttons.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-movie-details-page',
  standalone: true,
  imports: [
    MovieCarouselComponent,
    WishListButtonsComponent,
    MatProgressSpinner
  ],
  templateUrl: './movie-details-page.component.html',
  styleUrl: './movie-details-page.component.scss'
})
export class MovieDetailsPageComponent implements OnInit, OnDestroy{
  movie: Movie | null = null;
  movies: Movie[] = [];
  protected isLoading: boolean = true;
  private subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}



  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const movieIdString = params['id'];
      const movieId = movieIdString ? +movieIdString : null;

      if (movieId) {
        this.isLoading = true;
        this.fetchMovieDetails(movieId);
        this.fetchRecommendedMovies(movieId);
      }
    });
  }

  private fetchMovieDetails(movieId: number): void {
    this.movieService.getMovieById(movieId)
      .subscribe({
        next: (data: Movie) => {
          this.movie = mapMovie(data);
        },
        error: (error) => {
          console.error('Error fetching movie details:', error);
        }
      });
  }


  private fetchRecommendedMovies(movieId: number): void {
    this.subscription = this.movieService.getRecommendedMoviesForMovie(movieId)
      .subscribe({
        next: (data) => {
          this.movies = mapMovies(data);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching recommended movies', err);
        }
      });
  }


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  protected readonly name = name;
}
