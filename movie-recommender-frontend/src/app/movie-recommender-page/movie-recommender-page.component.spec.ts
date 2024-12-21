import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieRecommenderPageComponent } from './movie-recommender-page.component';

describe('MovieRecommenderPageComponent', () => {
  let component: MovieRecommenderPageComponent;
  let fixture: ComponentFixture<MovieRecommenderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieRecommenderPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieRecommenderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
