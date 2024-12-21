import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { MovieService } from '../services/movie.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { Movie } from '../models/movie';
import {MovieSuggestionSearchBarComponent} from "../movie-suggestion-search-bar/movie-suggestion-search-bar.component";

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let movieServiceSpy: jasmine.SpyObj<MovieService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    movieServiceSpy = jasmine.createSpyObj('MovieService', ['getMovieTitleSuggestions', 'getMovieForMovieTitle']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      providers: [
        { provide: MovieService, useValue: movieServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    component.movieSuggestionSearchBar = TestBed.createComponent(MovieSuggestionSearchBarComponent).componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the movie details page after searching', () => {
    const mockMovie: Movie = { id: 1, title: 'Movie Title', overview: 'Overview', poster_path: '/path/to/poster.jpg' };
    movieServiceSpy.getMovieForMovieTitle.and.returnValue(of(mockMovie));

    component.movieSuggestionSearchBar.searchControl.setValue('Movie Title');
    component.searchMovie();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/movie/1']);
  });

  it('should log an error if an error occurs while fetching the movie', () => {
    spyOn(console, 'error');
    const error = new Error('Network error');
    movieServiceSpy.getMovieForMovieTitle.and.returnValue(throwError(error));

    component.searchMovie();

    expect(console.error).toHaveBeenCalledWith('Error fetching movie:', error);
  });
});
