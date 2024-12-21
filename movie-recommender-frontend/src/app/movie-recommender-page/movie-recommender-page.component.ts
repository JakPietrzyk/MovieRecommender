import {Component, OnInit} from '@angular/core';
import {
  RecommendedMoviesCarouselComponent
} from "../movie-carousel/recomended-movies-carousel/recommended-movies-carousel.component";
import {FilterBarComponent} from "../filter-bar/filter-bar.component";
import {
  RecommendedMoviesWithFilterCarouselComponent
} from "../movie-carousel/recommended-movies-with-filter-carousel/recommended-movies-with-filter-carousel.component";
import {WishListPromptService} from "../services/wishList.prompt.service";

@Component({
  selector: 'app-movie-recommender-page',
  standalone: true,
  imports: [
    RecommendedMoviesCarouselComponent,
    FilterBarComponent,
    RecommendedMoviesWithFilterCarouselComponent
  ],
  templateUrl: './movie-recommender-page.component.html',
  styleUrl: './movie-recommender-page.component.scss'
})
export class MovieRecommenderPageComponent implements OnInit{
  constructor(private wishListPromptService: WishListPromptService) { }

  ngOnInit() {
    this.wishListPromptService.checkAndPromptWishlistIsEmpty().subscribe();
  }
}
