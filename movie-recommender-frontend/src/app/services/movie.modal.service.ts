import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Movie } from '../models/movie';
import {MovieDetailsModalComponent} from "../movie-carousel/movie-details-modal/movie-details-modal.component";

@Injectable({
    providedIn: 'root'
})
export class MovieModalService {
    constructor(private modalService: NgbModal) {}

    openMovieDetails(movie: Movie): void {
        const modalRef = this.modalService.open(MovieDetailsModalComponent);
        modalRef.componentInstance.selectedMovie = movie;
    }
}
