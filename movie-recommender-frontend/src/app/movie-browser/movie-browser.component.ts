import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {SearchBarComponent} from "../search-bar/search-bar.component";
import {FilterBarComponent} from "../filter-bar/filter-bar.component";
import {MovieSuggestionSearchBarComponent} from "../movie-suggestion-search-bar/movie-suggestion-search-bar.component";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MovieService} from "../services/movie.service";
import {Router, RouterLink} from "@angular/router";
import {Movie} from "../models/movie";
import {MoviesFilter} from "../models/movies.filter";
import {NgxPaginationModule} from "ngx-pagination";
import {NgForOf} from "@angular/common";
import {mapMovies} from '../mappers/movie.path.mapper';
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-movie-browser',
  standalone: true,
  imports: [
    SearchBarComponent,
    FilterBarComponent,
    MovieSuggestionSearchBarComponent,
    FormsModule,
    MatButton,
    NgxPaginationModule,
    NgForOf,
    RouterLink,
    MatProgressSpinner
  ],
  templateUrl: './movie-browser.component.html',
  styleUrl: './movie-browser.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieBrowserComponent implements AfterViewInit{
  @ViewChild(MovieSuggestionSearchBarComponent) movieSuggestionSearchBar!: MovieSuggestionSearchBarComponent;
  @ViewChild(FilterBarComponent) filterBar!: FilterBarComponent;
  movies: Movie[] = [];
  protected isLoading: boolean = false;
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private movieService: MovieService, private router: Router, private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    const savedMovies = sessionStorage.getItem('movies');
    const savedFilters = sessionStorage.getItem('movieFilters');
    const savedPage = sessionStorage.getItem('currentPage');

    if (savedMovies && savedFilters) {
      this.isLoading = false;
      this.movies = JSON.parse(savedMovies);
      const filters = JSON.parse(savedFilters);

      this.filterBar.selectedGenre = filters.genre;
      this.filterBar.selectedReleaseDate = filters.releaseDate;
      this.filterBar.selectedRating = filters.rating;
      this.movieSuggestionSearchBar.searchControl.setValue(filters.title);
      this.currentPage = savedPage ? JSON.parse(savedPage) : 1;
    }
  }

  searchMovie(): void {
    this.isLoading = true;
    const movieTitle = this.movieSuggestionSearchBar.searchControl.value || '';
    const filters = this.filterBar.applyFilters();
    const movieFilters: MoviesFilter = {
      movieTitle: movieTitle,
      genre: filters.genre,
      releaseDate: filters.releaseDate,
      rating: filters.rating
    }

    this.movieService
      .findAllMoviesForFilters(movieFilters)
        .subscribe((movies: Movie[]) => {
          this.isLoading = false;
          this.movies = mapMovies(movies);
          sessionStorage.setItem('movies', JSON.stringify(this.movies));
          sessionStorage.setItem('movieFilters', JSON.stringify(movieFilters));
          sessionStorage.setItem('currentPage', JSON.stringify(this.currentPage));
          this.cd.detectChanges()
        });
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
  }

  navigateToMovieDetailsPage(movie: Movie): void {
    this.router.navigate(['/movie', movie.id])
  }
}
