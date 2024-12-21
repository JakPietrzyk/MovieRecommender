import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WishListComponent } from './wish-list.component';
import { WishListService } from '../services/wishList.service';
import { AuthorizationService } from '../services/authorization.service';
import { MovieModalService } from '../services/movie.modal.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('WishListComponent', () => {
  let component: WishListComponent;
  let fixture: ComponentFixture<WishListComponent>;
  let wishListServiceMock: jasmine.SpyObj<WishListService>;
  let authorizationServiceMock: jasmine.SpyObj<AuthorizationService>;
  let movieModalServiceMock: jasmine.SpyObj<MovieModalService>;

  beforeEach(async () => {
    wishListServiceMock = jasmine.createSpyObj('WishListService', ['getWishList']);
    authorizationServiceMock = jasmine.createSpyObj('AuthorizationService', ['getCurrentUser']);
    movieModalServiceMock = jasmine.createSpyObj('MovieModalService', ['openMovieDetails']);

    await TestBed.configureTestingModule({
      imports: [WishListComponent],
      providers: [
        { provide: WishListService, useValue: wishListServiceMock },
        { provide: AuthorizationService, useValue: authorizationServiceMock },
        { provide: MovieModalService, useValue: movieModalServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadWishList on initialization', () => {
    spyOn(component, 'loadWishList');

    fixture.detectChanges();

    expect(component.loadWishList).toHaveBeenCalled();
  });

  it('should load the user\'s wishlist when the user is logged in', () => {
    const mockUser = { id: 1, login: 'login', password: 'password' };
    const mockMovies = [
      { id: 1, title: 'Movie 1', overview: 'Overview 1', poster_path: '/path1.jpg' },
      { id: 2, title: 'Movie 2', overview: 'Overview 2', poster_path: '/path2.jpg' }
    ];

    authorizationServiceMock.getCurrentUser.and.returnValue(mockUser);
    wishListServiceMock.getWishList.and.returnValue(of(mockMovies));

    component.loadWishList();

    expect(wishListServiceMock.getWishList).toHaveBeenCalledWith(mockUser);
    expect(component.movies.length).toBe(2);
    expect(component.movies[0].title).toBe('Movie 1');
  });

  it('should not display wishlist for not logged user', () => {
    authorizationServiceMock.getCurrentUser.and.returnValue(null);

    component.loadWishList();

    expect(wishListServiceMock.getWishList).not.toHaveBeenCalled();
  });

  it('should open movie details when a movie is clicked', () => {
    const mockMovie = { id: 1, title: 'Movie 1', overview: 'Overview 1', poster_path: '/path1.jpg' };
    component.movies = [mockMovie];

    fixture.detectChanges();

    const movieItem = fixture.debugElement.query(By.css('.movie-item')).nativeElement;
    movieItem.click();

    expect(movieModalServiceMock.openMovieDetails).toHaveBeenCalledWith(mockMovie);
  });
});
