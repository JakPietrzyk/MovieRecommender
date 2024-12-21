import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { MovieCarouselComponent } from './movie-carousel/movie-carousel.component';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MovieCarouselComponent, FilterBarComponent, CommonModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'movie-recommender-front';
}
