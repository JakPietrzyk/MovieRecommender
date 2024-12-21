import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieDetailsPageComponent } from './movie-details-page.component';
import { MovieService } from '../services/movie.service';
import {ActivatedRoute} from '@angular/router';
import { of, throwError } from 'rxjs';
import { Movie } from '../models/movie';
import { MovieCarouselComponent } from '../movie-carousel/movie-carousel.component';
import {mapMovie, mapMovies} from "../mappers/movie.path.mapper";

describe('MovieDetailsPageComponent', () => {
  let component: MovieDetailsPageComponent;
  let fixture: ComponentFixture<MovieDetailsPageComponent>;
  let movieServiceMock: jasmine.SpyObj<MovieService>;

  const mockMovie: Movie = { id: 1, title: 'Test Movie', overview: 'Test Overview', poster_path: '/test.jpg' };
  const mockRecommendedMovies: Movie[] = [
    { id: 2, title: 'Recommended Movie 1', overview: 'Overview 1', poster_path: '/test1.jpg' },
    { id: 3, title: 'Recommended Movie 2', overview: 'Overview 2', poster_path: '/test2.jpg' }
  ];

  beforeEach(async () => {
    movieServiceMock = jasmine.createSpyObj('MovieService', ['getMovieById', 'getRecommendedMoviesForMovie']);
    await TestBed.configureTestingModule({
      imports: [
        MovieCarouselComponent
      ],
      providers: [
        { provide: MovieService, useValue: movieServiceMock },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: '1' }) }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieDetailsPageComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movie details and recommended movies on init', () => {
    movieServiceMock.getMovieById.and.returnValue(of(mockMovie));
    movieServiceMock.getRecommendedMoviesForMovie.and.returnValue(of(mockRecommendedMovies));

    fixture.detectChanges();

    expect(movieServiceMock.getMovieById).toHaveBeenCalledWith(1);
    expect(movieServiceMock.getRecommendedMoviesForMovie).toHaveBeenCalledWith(1);
    expect(component.movie).toEqual(mapMovie(mockMovie));
    expect(component.movies).toEqual(mapMovies(mockRecommendedMovies));
  });

  it('should handle error when fetching movie details fails', () => {
    const consoleSpy = spyOn(console, 'error');
    movieServiceMock.getMovieById.and.returnValue(throwError(() => new Error('Failed to fetch movie')));
    movieServiceMock.getRecommendedMoviesForMovie.and.returnValue(of(mockRecommendedMovies));

    fixture.detectChanges();

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching movie details:', jasmine.any(Error));
    expect(component.movie).toBeNull();
  });

  it('should handle error when fetching recommended movies fails', () => {
    const consoleSpy = spyOn(console, 'error');
    movieServiceMock.getMovieById.and.returnValue(of(mockMovie));
    movieServiceMock.getRecommendedMoviesForMovie.and.returnValue(throwError(() => new Error('Failed to fetch recommended movies')));

    fixture.detectChanges();

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching recommended movies', jasmine.any(Error));
    expect(component.movies).toEqual([]);
  });
});
