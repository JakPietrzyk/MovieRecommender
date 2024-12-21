import {Component} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MovieService} from '../services/movie.service';
import {AsyncPipe} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {catchError, debounceTime, distinctUntilChanged, Observable, of, switchMap} from "rxjs";

@Component({
  selector: 'app-movie-suggestion-search-bar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatButton,
    FormsModule,
  ],
  templateUrl: './movie-suggestion-search-bar.component.html',
  styleUrl: './movie-suggestion-search-bar.component.scss'
})
export class MovieSuggestionSearchBarComponent {
  searchControl = new FormControl('');
  suggestions$: Observable<string[]> = of([]);

  constructor(private movieService: MovieService) {
    this.suggestions$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value =>
        value ? this.movieService.getMovieTitleSuggestions(value) : of([])),
      catchError(error => {
        console.error('Error fetching movie suggestions:', error);
        return of([]);
      })
    );
  }

  onSuggestionClick(suggestion: string): void {
    this.searchControl.setValue(suggestion);
  }
}
