import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Movie} from "../models/movie";
import {MovieModalService} from "../services/movie.modal.service";


@Component({
  selector: 'app-movie-carousel',
  templateUrl: './movie-carousel.component.html',
  styleUrls: ['./movie-carousel.component.scss'],
  standalone: true,
  imports: [CommonModule, NgOptimizedImage]
})
export class MovieCarouselComponent implements OnInit {
  @Input() movies: Movie[] = [];
  @ViewChild('movieCarousel', { static: true }) carousel!: ElementRef;

  constructor(protected movieModalService: MovieModalService) {}

  ngOnInit(): void {
  }

  next() {
    const carouselInner = this.carousel.nativeElement.querySelector('.carousel-inner');
    carouselInner.scrollBy({ left: 300, behavior: 'smooth' });
  }

  prev() {
    const carouselInner = this.carousel.nativeElement.querySelector('.carousel-inner');
    carouselInner.scrollBy({ left: -300, behavior: 'smooth' });
  }
}
