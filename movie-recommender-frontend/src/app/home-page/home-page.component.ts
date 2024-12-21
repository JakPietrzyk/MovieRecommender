import {Component, OnInit} from '@angular/core';
import { MovieCarouselComponent } from "../movie-carousel/movie-carousel.component";
import { FilterBarComponent } from "../filter-bar/filter-bar.component";
import { RecommendedMoviesCarouselComponent } from "../movie-carousel/recomended-movies-carousel/recommended-movies-carousel.component";
import {
  RecommendedMoviesFromWishListCarouselComponent
} from "../movie-carousel/recommended-movies-from-wishlist-carousel/recommended-movies-from-wishlist-carousel";
import {SearchBarComponent} from "../search-bar/search-bar.component";
import {
  RecommendedMoviesForGenreCarouselComponent
} from "../movie-carousel/recommended-movies-for-genre-carousel/recommended-movies-for-genre-carousel.component";
import {AuthorizationService} from "../services/authorization.service";
import {WishListPromptService} from "../services/wishList.prompt.service";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [MovieCarouselComponent, FilterBarComponent, RecommendedMoviesCarouselComponent, RecommendedMoviesFromWishListCarouselComponent, SearchBarComponent, RecommendedMoviesForGenreCarouselComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit{
  protected isWishListEmpty: boolean = false;

  constructor(
    protected authorizationService: AuthorizationService,
    private wishListPromptService: WishListPromptService
  ) { }

  ngOnInit() {
    this.wishListPromptService.checkAndPromptWishlistIsEmpty().subscribe();
  }
}
