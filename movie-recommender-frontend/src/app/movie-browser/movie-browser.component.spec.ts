import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieBrowserComponent } from './movie-browser.component';
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";

describe('MovieBrowserComponent', () => {
  let component: MovieBrowserComponent;
  let fixture: ComponentFixture<MovieBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieBrowserComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimationsAsync()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
