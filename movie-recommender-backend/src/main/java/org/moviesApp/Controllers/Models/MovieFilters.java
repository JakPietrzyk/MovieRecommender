package org.moviesApp.Controllers.Models;

import info.movito.themoviedbapi.model.core.Movie;

public record  MovieFilters(String movieTitle, String genre, int releaseDate, float rating, Movie[] lastRecommendations ) {
}
