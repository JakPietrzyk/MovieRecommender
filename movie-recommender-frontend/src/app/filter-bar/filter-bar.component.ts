import {Component, OnInit} from '@angular/core';
import {MovieService} from "../services/movie.service";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss'
})
export class FilterBarComponent implements OnInit {
  genres: string[] = [];
  currentYear: number = new Date().getFullYear();
  selectedGenre: string = '';
  selectedReleaseDate: number = 2000;
  selectedRating: number = 5;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getAllMoviesGenres().subscribe((genres: string[]) => {
      this.genres = genres;
    });
  }

  applyFilters(): { genre: string; releaseDate: number; rating: number } {
    return {
      genre: this.selectedGenre,
      releaseDate: this.selectedReleaseDate,
      rating: this.selectedRating,
    };
  }
}
