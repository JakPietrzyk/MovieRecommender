import {AfterViewInit, Component, Input, OnDestroy, ViewChild} from '@angular/core';
import {MovieCarouselComponent} from "../movie-carousel.component";
import { MovieService } from '../../services/movie.service';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { Movie } from '../../models/movie';
import { MovieDetailsModalComponent } from "../movie-details-modal/movie-details-modal.component";
import {Subscription} from "rxjs";
import {mapMovies} from "../../mappers/movie.path.mapper";
import {FilterBarComponent} from "../../filter-bar/filter-bar.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-recommended-movies-with-filter-carousel',
  standalone: true,
  imports: [CommonModule, MovieDetailsModalComponent, NgOptimizedImage, MovieCarouselComponent, FilterBarComponent, MatProgressSpinner],
  templateUrl: './recommended-movies-with-filter-carousel.component.html',
  styleUrl: './recommended-movies-with-filter-carousel.component.scss'
})
export class RecommendedMoviesWithFilterCarouselComponent implements AfterViewInit, OnDestroy{
  @Input() movies: Movie[] = [];
  lastRecommendations: Movie[] = [];
  private subscription?: Subscription;
  protected isLoading: boolean = true;
  @ViewChild(FilterBarComponent) filterBar!: FilterBarComponent;


  constructor(
    private movieService: MovieService,
  ) {}

  ngAfterViewInit(): void {
    this.fetchMoviesWithFilters();
  }

  public fetchMoviesWithFilters() {
    const filters = this.filterBar.applyFilters();
    this.isLoading = true;
    this.subscription = this.movieService.getRecommendedMoviesForFilters({
      genre: filters.genre,
      releaseDate: filters.releaseDate,
      rating: filters.rating
    })
      .subscribe({
        next: (data) => {
          this.movies = mapMovies(data)
          data.forEach(movie => this.lastRecommendations.push(movie));
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching movies', err);
        }
      });
  }

  public fetchOtherMoviesWithFilters() {
    const filters = this.filterBar.applyFilters();
    this.isLoading = true;
    this.subscription = this.movieService.getRecommendedMoviesForFilters({
      genre: filters.genre,
      releaseDate: filters.releaseDate,
      rating: filters.rating,
      lastRecommendations: this.lastRecommendations
    })
      .subscribe({
        next: (data) => {
          this.movies = mapMovies(data)
          data.forEach(movie => this.lastRecommendations.push(movie));
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
