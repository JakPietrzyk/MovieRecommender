import { ComponentFixture, TestBed } from '@angular/core/testing';
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {MovieCarouselComponent} from "./movie-carousel.component";
import {of} from "rxjs";
import {By} from "@angular/platform-browser";
import {MovieService} from "../services/movie.service";
import {MovieModalService} from "../services/movie.modal.service";

describe('MovieCarouselComponent', () => {
  let component: MovieCarouselComponent;
  let fixture: ComponentFixture<MovieCarouselComponent>;
  let movieServiceMock: jasmine.SpyObj<MovieService>;
  let movieModalServiceMock: jasmine.SpyObj<MovieModalService>;

  const mockMovies = [
    { id: 1, title: 'Movie 1', overview: 'Overview 1', poster_path: '/path1.jpg' },
    { id: 2, title: 'Movie 2', overview: 'Overview 2', poster_path: '/path2.jpg' },
  ];

  beforeEach(async () => {
    movieServiceMock = jasmine.createSpyObj('MovieService', ['getTrendingMovies']);
    movieModalServiceMock = jasmine.createSpyObj('MovieModalService', ['openMovieDetails']);

    await TestBed.configureTestingModule({
      imports: [MovieCarouselComponent],
      providers: [
        { provide: MovieService, useValue: movieServiceMock },
        { provide: MovieModalService, useValue: movieModalServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieCarouselComponent);
    component = fixture.componentInstance;
    component.movies = mockMovies;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display movies in the carousel', () => {
    component.movies = mockMovies;
    fixture.detectChanges();

    const movieItems = fixture.debugElement.queryAll(By.css('.movie-item'));

    expect(movieItems.length).toBe(2);
  });

  it('should open movie details modal when a movie is clicked', () => {
    movieServiceMock.getTrendingMovies.and.returnValue(of(mockMovies));

    fixture.detectChanges();

    const movieItem = fixture.debugElement.query(By.css('#movie-image'));

    movieItem.triggerEventHandler('click', null);

    expect(movieModalServiceMock.openMovieDetails).toHaveBeenCalledTimes(1);
  });
});
