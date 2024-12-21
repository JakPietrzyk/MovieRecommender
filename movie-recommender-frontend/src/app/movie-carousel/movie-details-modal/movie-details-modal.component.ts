import {Component, Input} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Movie } from '../../models/movie';
import { CommonModule } from '@angular/common';
import {Router} from "@angular/router";
import {WishListButtonsComponent} from "./wish-list-buttons/wish-list-buttons.component";


@Component({
  selector: 'app-movie-details-modal',
  standalone: true,
  imports: [CommonModule, WishListButtonsComponent],
  templateUrl: './movie-details-modal.component.html',
  styleUrl: './movie-details-modal.component.scss'
})
export class MovieDetailsModalComponent{
  @Input() selectedMovie: Movie | null = null;
  isMovieInWishlist = false;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router
  ) {}

  openMovieDetailsPage(movie: Movie | null): void {
    if (movie && movie.id) {
      this.router.navigate([`/movie/${movie.id}`]);
      this.activeModal.close();
    } else {
      console.error('Movie ID is not defined.');
    }
  }
}
