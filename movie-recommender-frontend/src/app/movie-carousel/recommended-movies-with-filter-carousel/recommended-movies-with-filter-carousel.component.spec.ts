import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedMoviesWithFilterCarouselComponent } from './recommended-movies-with-filter-carousel.component';

describe('RecommendedMoviesWithFilterCarouselComponent', () => {
  let component: RecommendedMoviesWithFilterCarouselComponent;
  let fixture: ComponentFixture<RecommendedMoviesWithFilterCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendedMoviesWithFilterCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendedMoviesWithFilterCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
