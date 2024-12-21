import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MovieCarouselComponent} from "../movie-carousel.component";
import {Movie} from "../../models/movie";
import {Subscription} from "rxjs";
import {MovieRecommendationsForTitle} from "../../models/movie.recommendations.for.title";
import {MovieService} from "../../services/movie.service";
import {mapRecommendedMoviesResponse} from "../../mappers/movie.path.mapper";

@Component({
  selector: 'app-recommended-movies-for-genre-carousel',
  standalone: true,
  imports: [
    MovieCarouselComponent
  ],
  templateUrl: './recommended-movies-for-genre-carousel.component.html',
  styleUrl: './recommended-movies-for-genre-carousel.component.scss'
})
export class RecommendedMoviesForGenreCarouselComponent implements OnInit, OnDestroy{
  @Input() NUMBER_OF_MOVIES_CAROUSELS = 4;

  private subscription?: Subscription;

  movies: Movie[] = [];
  recommendedMoviesResponse: MovieRecommendationsForTitle[] = [];

  constructor(
    private movieService: MovieService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.movieService.getRecommendedMoviesForEachGenre(this.NUMBER_OF_MOVIES_CAROUSELS)
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
