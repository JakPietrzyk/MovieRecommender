package org.moviesApp.Controllers.MovieControllers.Responses;


import org.moviesApp.Repositories.Models.Movie;

import java.util.List;

public record RandomMovieRecommendationsResponse(String movieTitle, List<Movie> recommendedMovies) {
}
