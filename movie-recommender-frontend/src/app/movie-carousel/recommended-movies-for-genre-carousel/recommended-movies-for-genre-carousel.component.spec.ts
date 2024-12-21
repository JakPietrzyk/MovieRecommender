import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedMoviesForGenreCarouselComponent } from './recommended-movies-for-genre-carousel.component';

describe('RecommendedMoviesForGenreCarouselComponent', () => {
  let component: RecommendedMoviesForGenreCarouselComponent;
  let fixture: ComponentFixture<RecommendedMoviesForGenreCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendedMoviesForGenreCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendedMoviesForGenreCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
