package org.moviesApp.Clients;

import org.moviesApp.Repositories.Models.Movie;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class MoviesClient {
    @Value("${apiUrl.python}")
    private String apiUrlPython;
    private final RestTemplate restTemplate;
    private static final Logger logger = LoggerFactory.getLogger(MoviesClient.class);

    @Autowired
    public MoviesClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<Movie> getMoviesByIds(List<Integer> movieIds) {
        return movieIds.stream().map(this::getMovieById).toList();
    }

    public Movie getMovieById(int movieId) {
        String url = apiUrlPython + "/movies/" + movieId;

        try {
            ResponseEntity<Movie> response = restTemplate.getForEntity(url, Movie.class);

            return response.getBody();
        } catch (Exception e) {
            logger.error("Failed getting movie details by id: {}. {}", movieId, e.getMessage());
            return null;
        }
    }

    public List<Movie> getMoviesByTitles(List<String> movieTitles) {
        return movieTitles.stream()
                .map(this::getMovieByTitle)
                .filter(Objects::nonNull)
                .toList();
    }

    public Movie getMovieByTitle(String movieTitle) {
        try {
            String url = apiUrlPython + "/movies/search?title=" + movieTitle;

            ResponseEntity<Movie> response = restTemplate.getForEntity(url, Movie.class);

            return Optional.ofNullable(response.getBody())
                    .orElseThrow(() -> new RuntimeException("Movie not found"));

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch movie data", e);
        }
    }
}
