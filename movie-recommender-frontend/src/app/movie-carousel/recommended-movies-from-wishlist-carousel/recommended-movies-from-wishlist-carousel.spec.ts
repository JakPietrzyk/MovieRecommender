import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieService } from '../../services/movie.service';
import { MovieModalService } from '../../services/movie.modal.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import {RecommendedMoviesFromWishListCarouselComponent} from "./recommended-movies-from-wishlist-carousel";
import {MovieRecommendationsForTitle} from "../../models/movie.recommendations.for.title";
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";

describe('RecommendedMoviesFromWishListCarouselComponent', () => {
  let component: RecommendedMoviesFromWishListCarouselComponent;
  let fixture: ComponentFixture<RecommendedMoviesFromWishListCarouselComponent>;
  let movieServiceMock: jasmine.SpyObj<MovieService>;
  let movieModalServiceMock: jasmine.SpyObj<MovieModalService>;

  const mockMovies: MovieRecommendationsForTitle[] = [
    {
      movieTitle: 'Movie 1',
      recommendedMovies: [
        { id: 1, title: 'Recommended Movie 1', overview: 'Overview 1', poster_path: '/path1.jpg' },
        { id: 2, title: 'Recommended Movie 2', overview: 'Overview 2', poster_path: '/path2.jpg' }
      ]
    },
    {
      movieTitle: 'Movie 2',
      recommendedMovies: [
        { id: 3, title: 'Recommended Movie 3', overview: 'Overview 3', poster_path: '/path3.jpg' },
        { id: 4, title: 'Recommended Movie 4', overview: 'Overview 4', poster_path: '/path4.jpg' }
      ]
    }
  ];


  beforeEach(async () => {
    movieServiceMock = jasmine.createSpyObj('MovieService', ['getRecommendedMoviesForEachMovieInUserWishList']);
    movieModalServiceMock = jasmine.createSpyObj('MovieModalService', ['openMovieDetails']);

    await TestBed.configureTestingModule({
      imports: [RecommendedMoviesFromWishListCarouselComponent],
      providers: [
        { provide: MovieService, useValue: movieServiceMock },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendedMoviesFromWishListCarouselComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch recommended movies on init', () => {
    movieServiceMock.getRecommendedMoviesForEachMovieInUserWishList.and.returnValue(of(mockMovies));

    fixture.detectChanges();

    expect(movieServiceMock.getRecommendedMoviesForEachMovieInUserWishList).toHaveBeenCalled();
    expect(component.recommendedMoviesResponse.length).toBe(2);
    expect(component.recommendedMoviesResponse[0].movieTitle).toBe('Movie 1');
  });

  it('should display movies in the carousel', () => {
    movieServiceMock.getRecommendedMoviesForEachMovieInUserWishList.and.returnValue(of(mockMovies));

    fixture.detectChanges();

    const movieItems = fixture.debugElement.queryAll(By.css('.movie-item'));

    expect(movieItems.length).toBe(4);
  });
});

