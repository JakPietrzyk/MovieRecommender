import {Movie} from "./movie";

export interface MoviesFilter {
  movieTitle?: string,
  genre: string ,
  releaseDate: number,
  rating: number,
  lastRecommendations? : Movie[]
}




