import {Component, OnDestroy, OnInit} from '@angular/core';
import { MovieService } from '../../services/movie.service';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { Movie } from '../../models/movie';
import { MovieDetailsModalComponent } from "../movie-details-modal/movie-details-modal.component";
import {MovieCarouselComponent} from "../movie-carousel.component";
import {Subscription} from "rxjs";
import {mapMovies} from "../../mappers/movie.path.mapper";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-recomended-movies-carousel',
  standalone: true,
  imports: [CommonModule, MovieDetailsModalComponent, NgOptimizedImage, MovieCarouselComponent, MatProgressSpinner],
  templateUrl: './recommended-movies-carousel.component.html',
  styleUrl: './recommended-movies-carousel.component.scss'
})
export class RecommendedMoviesCarouselComponent implements OnInit, OnDestroy{
  movies: Movie[] = [];
  protected isLoading: boolean = true;
  private subscription?: Subscription;

  constructor(
    private movieService: MovieService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.movieService.getRecommendedMovies()
      .subscribe({
        next: (data) => {
          this.movies = mapMovies(data);
          this.isLoading = false;
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
