import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MovieDetailsModalComponent } from './movie-details-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthorizationService } from '../../services/authorization.service';
import { WishListService } from '../../services/wishList.service';
import { Movie } from '../../models/movie';
import { User } from '../../models/user.model';
import { By } from '@angular/platform-browser';
import {ApiResponse} from "../../models/api.response";

describe('MovieDetailsModalComponent', () => {
  let component: MovieDetailsModalComponent;
  let fixture: ComponentFixture<MovieDetailsModalComponent>;
  let authorizationServiceMock: jasmine.SpyObj<AuthorizationService>;
  let wishListServiceMock: jasmine.SpyObj<WishListService>;

  const mockUser: User = { id: 1, login: 'testUser' } as User;
  const mockMovie: Movie = { id: 1, title: 'Test Movie', poster_path: '', overview: '' } as Movie;

  beforeEach(async () => {
    authorizationServiceMock = jasmine.createSpyObj('AuthorizationService', ['getCurrentUser', 'isLoggedIn']);
    wishListServiceMock = jasmine.createSpyObj('WishListService', ['checkMovieExistsInWishlist', 'addMovieToWishList', 'removeFromWishList']);

    await TestBed.configureTestingModule({
      imports: [MovieDetailsModalComponent],
      providers: [
        { provide: NgbActiveModal, useValue: jasmine.createSpyObj('NgbActiveModal', ['close']) },
        { provide: AuthorizationService, useValue: authorizationServiceMock },
        { provide: WishListService, useValue: wishListServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailsModalComponent);
    component = fixture.componentInstance;
    component.selectedMovie = mockMovie;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if movie is in wishlist on init', () => {
    authorizationServiceMock.getCurrentUser.and.returnValue(mockUser);
    wishListServiceMock.checkMovieExistsInWishlist.and.returnValue(of(true));

    fixture.detectChanges();

    expect(wishListServiceMock.checkMovieExistsInWishlist).toHaveBeenCalledWith(mockUser, mockMovie);
    expect(component.isMovieInWishlist).toBeTrue();
  });

  it('should add movie to wishlist', () => {
    const mockApiResponse: ApiResponse = { message: 'Movie added to wishlist successfully' };

    authorizationServiceMock.getCurrentUser.and.returnValue(mockUser);
    wishListServiceMock.addMovieToWishList.and.returnValue(of(mockApiResponse));

    component.addToWishlist(mockMovie);

    expect(wishListServiceMock.addMovieToWishList).toHaveBeenCalledWith(mockUser, mockMovie);
    expect(component.isMovieInWishlist).toBeTrue();
  });


  it('should do nothing if movie is invalid', () => {
    component.addToWishlist(null);

    expect(component.isMovieInWishlist).toBeFalse();
    expect(wishListServiceMock.addMovieToWishList).toHaveBeenCalledTimes(0);

  });

  it('should remove movie from wishlist', () => {
    const mockApiResponse: ApiResponse = { message: 'response' };

    authorizationServiceMock.getCurrentUser.and.returnValue(mockUser);
    wishListServiceMock.removeFromWishList.and.returnValue(of(mockApiResponse));

    component.removeFromWishList(mockMovie);

    expect(wishListServiceMock.removeFromWishList).toHaveBeenCalledWith(mockUser, mockMovie);
    expect(component.isMovieInWishlist).toBeFalse();
  });

  it('should not remove if invalid movie', () => {
    component.removeFromWishList(null);

    expect(wishListServiceMock.removeFromWishList).toHaveBeenCalledTimes(0);
  });

  it('should display "Add to Wishlist" button if movie is not in wishlist', () => {
    wishListServiceMock.checkMovieExistsInWishlist.and.returnValue(of(false));
    authorizationServiceMock.isLoggedIn.and.returnValue(true);

    fixture.detectChanges();

    const addButton = fixture.debugElement.query(By.css('.btn-primary'));
    const removeButton = fixture.debugElement.query(By.css('.btn-danger'));

    expect(addButton).not.toBeNull();
    expect(removeButton).toBeNull();
  });

  it('should display "Remove from Wishlist" button if movie is in wishlist', () => {
    wishListServiceMock.checkMovieExistsInWishlist.and.returnValue(of(true));
    authorizationServiceMock.isLoggedIn.and.returnValue(true);

    fixture.detectChanges();

    const addButton = fixture.debugElement.query(By.css('.btn-primary'));
    const removeButton = fixture.debugElement.query(By.css('.btn-danger'));

    expect(addButton).toBeNull();
    expect(removeButton).not.toBeNull();
  });

  it('should not display Add/Remove from Wishlist if user is not logged in', () => {
    wishListServiceMock.checkMovieExistsInWishlist.and.returnValue(of(true));
    authorizationServiceMock.isLoggedIn.and.returnValue(false);

    fixture.detectChanges();

    const addButton = fixture.debugElement.query(By.css('.btn-primary'));
    const removeButton = fixture.debugElement.query(By.css('.btn-danger'));

    expect(addButton).toBeNull();
    expect(removeButton).toBeNull();
  });

});
