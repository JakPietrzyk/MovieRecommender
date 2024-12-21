import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecommendedMoviesCarouselComponent } from './recommended-movies-carousel.component';
import { MovieService } from '../../services/movie.service';
import { MovieModalService } from '../../services/movie.modal.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('RecomendedMoviesCarouselComponent', () => {
  let component: RecommendedMoviesCarouselComponent;
  let fixture: ComponentFixture<RecommendedMoviesCarouselComponent>;
  let movieServiceMock: jasmine.SpyObj<MovieService>;
  let movieModalServiceMock: jasmine.SpyObj<MovieModalService>;

  const mockMovies = [
    { id: 1, title: 'Movie 1', overview: 'Overview 1', poster_path: '/path1.jpg' },
    { id: 2, title: 'Movie 2', overview: 'Overview 2', poster_path: '/path2.jpg' },
  ];

  beforeEach(async () => {
    movieServiceMock = jasmine.createSpyObj('MovieService', ['getRecommendedMovies']);
    movieModalServiceMock = jasmine.createSpyObj('MovieModalService', ['openMovieDetails']);

    await TestBed.configureTestingModule({
      imports: [RecommendedMoviesCarouselComponent],
      providers: [
        { provide: MovieService, useValue: movieServiceMock },
        { provide: MovieModalService, useValue: movieModalServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendedMoviesCarouselComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch recommended movies on init', () => {
    movieServiceMock.getRecommendedMovies.and.returnValue(of(mockMovies));

    fixture.detectChanges();

    expect(movieServiceMock.getRecommendedMovies).toHaveBeenCalled();
    expect(component.movies.length).toBe(2);
    expect(component.movies[0].title).toBe('Movie 1');
  });

  it('should display movies in the carousel', () => {
    movieServiceMock.getRecommendedMovies.and.returnValue(of(mockMovies));

    fixture.detectChanges();

    const movieItems = fixture.debugElement.queryAll(By.css('.movie-item'));

    expect(movieItems.length).toBe(2);
  });

  it('should adjust movie poster path after initializing movies', () => {
    movieServiceMock.getRecommendedMovies.and.returnValue(of(mockMovies));

    fixture.detectChanges();

    const movieItem = fixture.debugElement.query(By.css('#movie-image'));

    movieItem.triggerEventHandler('click', null);

    mockMovies[0].poster_path = 'https://image.tmdb.org/t/p/w500' + mockMovies[0].poster_path;
    expect(movieModalServiceMock.openMovieDetails).toHaveBeenCalledWith(mockMovies[0]);
  });

  it('should open movie details modal when a movie is clicked', () => {
    movieServiceMock.getRecommendedMovies.and.returnValue(of(mockMovies));

    fixture.detectChanges();

    const movieItem = fixture.debugElement.query(By.css('#movie-image'));

    movieItem.triggerEventHandler('click', null);

    expect(movieModalServiceMock.openMovieDetails).toHaveBeenCalledTimes(1);
  });
});

