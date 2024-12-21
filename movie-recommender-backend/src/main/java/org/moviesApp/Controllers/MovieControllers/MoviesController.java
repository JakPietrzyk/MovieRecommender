package org.moviesApp.Controllers.MovieControllers;

import org.moviesApp.Controllers.Models.MovieFilters;
import org.moviesApp.Controllers.MovieControllers.Responses.RandomGenreRecommendationsResponse;
import org.moviesApp.Repositories.Models.Movie;
import org.moviesApp.Services.MovieRecommenderService;
import org.moviesApp.Clients.MoviesClient;
import org.moviesApp.Controllers.MovieControllers.Responses.RandomMovieRecommendationsResponse;
import org.moviesApp.Exceptions.MovieNotFoundInDatabaseException;
import org.moviesApp.Services.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MoviesController {

    private final MoviesClient moviesClient;
    private final MovieRecommenderService movieRecommenderService;
    private final MovieService movieService;

    @Autowired
    public MoviesController(MoviesClient moviesClient, MovieRecommenderService movieRecommenderService, MovieService movieService) {
        this.moviesClient = moviesClient;
        this.movieRecommenderService = movieRecommenderService;
        this.movieService = movieService;
    }

    @GetMapping("/users/{userId}/wishList/recommend/{numberOfRecommendations}")
    public List<RandomMovieRecommendationsResponse> getRecommendedMoviesForMoviesInUserWishList(@PathVariable Long userId, @PathVariable int numberOfRecommendations) throws MovieNotFoundInDatabaseException {
        List<Integer> moviesIds = movieService.getUserMoviesIds(userId);

        return movieRecommenderService.recommendMoviesForMoviesIds(moviesIds, numberOfRecommendations);
    }

    @GetMapping("/users/{userId}/wishList/recommend/{numberOfRecommendations}/genre")
    public List<RandomGenreRecommendationsResponse> getRecommendedMoviesForGenre(@PathVariable Long userId, @PathVariable int numberOfRecommendations) throws MovieNotFoundInDatabaseException {
        List<Integer> userMoviesIds = movieService.getUserMoviesIds(userId);
        List<String> userGenres = movieService.getUserMovieGenres(userId);

        return movieRecommenderService.recommendMoviesForMovieIdsWithGenresFilter(userMoviesIds, userGenres, numberOfRecommendations);
    }

    @GetMapping("/users/{userId}/recommended")
    public List<Movie> getRecommendedMovies(@PathVariable Long userId) throws MovieNotFoundInDatabaseException {
        List<Integer> userMoviesIds = movieService.getUserMoviesIds(userId);

        return movieRecommenderService.getRecommendedMoviesForMovieIds(userMoviesIds, "");
    }

    @GetMapping("/users/{userId}/recommended/{genre}")
    public List<Movie> getRecommendedMovies(@PathVariable Long userId, @PathVariable String genre) throws MovieNotFoundInDatabaseException {
        List<Integer> userMoviesIds = movieService.getUserMoviesIds(userId);

        return movieRecommenderService.getRecommendedMoviesForMovieIds(userMoviesIds, genre);
    }

    @PostMapping("/users/{userId}/recommended")
    public List<Movie> getRecommendedMoviesForFilters(@PathVariable Long userId, @RequestBody MovieFilters movieFilters) throws MovieNotFoundInDatabaseException {
        List<Integer> userMoviesIds = movieService.getUserMoviesIds(userId);

        List<String> recommendedTitles = movieRecommenderService.getRecommendedMoviesForMovieIdsWithFilters(userMoviesIds, movieFilters);
        return moviesClient.getMoviesByTitles(recommendedTitles);
    }

    @GetMapping("/recommend/{movieId}")
    public List<Movie> getRecommendedMoviesForMovie(@PathVariable int movieId) throws MovieNotFoundInDatabaseException {
        return movieRecommenderService.getRecommendedMoviesForMovieId(movieId, "");
    }

    @GetMapping("/{movieId}")
    public Movie getMovieById(@PathVariable int movieId) {
        return moviesClient.getMovieById(movieId);
    }

    @PostMapping
    public List<Movie> getMoviesByIds(@RequestBody List<Integer> movieIds) {
        return moviesClient.getMoviesByIds(movieIds);
    }

    @PostMapping("/suggestions")
    public Movie getMovieForMovieTitle(@RequestBody String movieTitle) {
        return moviesClient.getMovieByTitle(movieTitle);
    }

    @PostMapping("/data")
    public List<Movie> getMoviesForMoviesTitles(@RequestBody List<String> movieTitles) {
        return moviesClient.getMoviesByTitles(movieTitles);
    }
}
