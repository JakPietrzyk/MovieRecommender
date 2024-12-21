import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageComponent } from './home-page.component';
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {By} from "@angular/platform-browser";
import {FilterBarComponent} from "../filter-bar/filter-bar.component";
import {MovieCarouselComponent} from "../movie-carousel/movie-carousel.component";
import {
  RecommendedMoviesCarouselComponent
} from "../movie-carousel/recomended-movies-carousel/recommended-movies-carousel.component";
import {AuthorizationService} from "../services/authorization.service";
import {User} from "../models/user.model";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let authorizationServiceMock: jasmine.SpyObj<AuthorizationService>;


  beforeEach(async () => {
    authorizationServiceMock = jasmine.createSpyObj('AuthorizationService', ['getCurrentUser']);

    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthorizationService, useValue: authorizationServiceMock },
        provideAnimationsAsync()
      ]
    })
    .compileComponents();

    const mockUser: User = { id: 1, login: 'login', password: 'password' };
    authorizationServiceMock.getCurrentUser.and.returnValue(mockUser);

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the hero section title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heroTitle = compiled.querySelector('.hero-section h1')?.textContent;

    expect(heroTitle).toContain('Discover your next favorite movie with');
  });

  it('should render the filter bar component', () => {
    const filterBarElement = fixture.debugElement.query(By.directive(FilterBarComponent));

    expect(filterBarElement).not.toBeNull();
  });

  it('should render the popular movies section with MovieCarouselComponent', () => {
    const movieCarouselElement = fixture.debugElement.query(By.directive(MovieCarouselComponent));
    const sectionTitle = fixture.nativeElement.querySelector('.section h2').textContent;

    expect(movieCarouselElement).not.toBeNull();
    expect(sectionTitle).toContain('Popular movies');
  });

  it('should render the recommended movies section with RecomendedMoviesCarouselComponent', () => {
    const recommendedMoviesElement = fixture.debugElement.query(By.directive(RecommendedMoviesCarouselComponent));
    const sectionTitle = fixture.nativeElement.querySelectorAll('.section h2')[1].textContent;

    expect(recommendedMoviesElement).not.toBeNull();
    expect(sectionTitle).toContain('Your Recommendations');
  });
});
