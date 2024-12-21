import {Component, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MovieService} from '../services/movie.service';
import {AsyncPipe} from "@angular/common";
import {Router} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {Movie} from "../models/movie";
import {MovieSuggestionSearchBarComponent} from "../movie-suggestion-search-bar/movie-suggestion-search-bar.component";

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatButton,
    FormsModule,
    MovieSuggestionSearchBarComponent
  ],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

  @ViewChild(MovieSuggestionSearchBarComponent) movieSuggestionSearchBar!: MovieSuggestionSearchBarComponent;

  constructor(private movieService: MovieService,
              private router: Router
  ) {}

  searchMovie(): void {
    const movieTitle = this.movieSuggestionSearchBar.searchControl.value;

    this.movieService.getMovieForMovieTitle(movieTitle as string)
      .subscribe({
        next: (movie: Movie) => {
          if (movie) {
            this.router.navigate([`/movie/${movie.id}`]);
          } else {
            console.error('Movie not found');
          }
        },
        error: (error) => {
          console.error('Error fetching movie:', error);
        }
      });
  }

}
