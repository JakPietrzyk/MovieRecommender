import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieSuggestionSearchBarComponent } from './movie-suggestion-search-bar.component';
import { MovieService } from '../services/movie.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";

describe('MovieSuggestionSearchBarComponent', () => {
  let component: MovieSuggestionSearchBarComponent;
  let fixture: ComponentFixture<MovieSuggestionSearchBarComponent>;
  let movieServiceSpy: jasmine.SpyObj<MovieService>;

  beforeEach(async () => {
    movieServiceSpy = jasmine.createSpyObj('MovieService', ['getMovieTitleSuggestions']);

    await TestBed.configureTestingModule({
      providers: [
        { provide: MovieService, useValue: movieServiceSpy },
        provideAnimationsAsync()
      ],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieSuggestionSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movie title suggestions based on input', () => {
    const mockSuggestions = ['Movie 1', 'Movie 2'];
    movieServiceSpy.getMovieTitleSuggestions.and.returnValue(of(mockSuggestions));

    component.searchControl.setValue('Mov');
    component.suggestions$.subscribe(suggestions => {
      expect(suggestions).toEqual(mockSuggestions);
    });
  });

  it('should set the movie title after clicking on a suggestion', () => {
    const suggestion = 'Movie Title';
    component.onSuggestionClick(suggestion);
    expect(component.searchControl.value).toBe(suggestion);
  });

  it('should handle errors when fetching movie title suggestions', () => {
    const error = new Error();
    spyOn(console, 'error');
    movieServiceSpy.getMovieTitleSuggestions.and.returnValue(throwError(() => error));

    component.searchControl.setValue('Test');

    component.suggestions$.subscribe(suggestions => {
      expect(suggestions).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Error fetching movie suggestions:', error);
    });
  });
});
