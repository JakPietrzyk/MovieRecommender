import {Movie} from "./movie";

export interface MovieRecommendationsForTitle
{
  movieTitle : string,
  recommendedMovies : Movie[]
}
