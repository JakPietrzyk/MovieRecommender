package org.moviesApp.Services;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.moviesApp.Clients.MoviesClient;
import org.moviesApp.Controllers.Models.MovieFilters;
import org.moviesApp.Controllers.MovieControllers.Responses.RandomGenreRecommendationsResponse;
import org.moviesApp.Controllers.MovieControllers.Responses.RandomMovieRecommendationsResponse;
import org.moviesApp.Exceptions.MovieNotFoundInDatabaseException;
import org.moviesApp.Repositories.Models.Movie;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class MovieRecommenderService {

    @Value("${apiUrl.python}")
    private String apiUrlPython;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final MoviesClient moviesClient;
    private static final Logger logger = LoggerFactory.getLogger(MovieRecommenderService.class);

    @Autowired
    public MovieRecommenderService(RestTemplate restTemplate, ObjectMapper objectMapper, MoviesClient moviesClient) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.moviesClient = moviesClient;
    }

    public List<RandomMovieRecommendationsResponse> recommendMoviesForMoviesIds(List<Integer> movieIds, int numberOfRecommendations) throws MovieNotFoundInDatabaseException {
        List<RandomMovieRecommendationsResponse> moviesRecommendationsResponses = new ArrayList<>();

        for (Integer movieId : movieIds) {
            if (moviesRecommendationsResponses.size() >= numberOfRecommendations) {
                break;
            }

            List<Movie> recommendedMovies = getRecommendedMoviesForMovieId(movieId, "");
            if (recommendedMovies.isEmpty()) {
                continue;
            }

            moviesRecommendationsResponses.add(new RandomMovieRecommendationsResponse(moviesClient.getMovieById(movieId).getTitle(), recommendedMovies));
        }

        return moviesRecommendationsResponses;
    }

    public List<RandomGenreRecommendationsResponse> recommendMoviesForMovieIdsWithGenresFilter(List<Integer> movieIds, List<String> userGenres, int numberOfRecommendations) throws MovieNotFoundInDatabaseException {
        List<RandomGenreRecommendationsResponse> moviesRecommendationsResponses = new ArrayList<>();

        for (String genre : userGenres) {
            if (moviesRecommendationsResponses.size() >= numberOfRecommendations) {
                break;
            }

            List<Movie> recommendedTitles = getRecommendedMoviesForMovieIds(movieIds, genre);
            if (recommendedTitles.isEmpty()) {
                continue;
            }

            moviesRecommendationsResponses.add(new RandomGenreRecommendationsResponse(genre, recommendedTitles));
        }

        return moviesRecommendationsResponses;
    }

    public List<String> getRecommendedMoviesForMovieIdsWithFilters(List<Integer> movieIds, MovieFilters movieFilters) throws MovieNotFoundInDatabaseException {
        String apiUrl = apiUrlPython + "/recommend_movies_for_ids_with_filters";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("movieIds", movieIds);
        addFiltersToRequestIfNeeded(movieFilters, requestBody);
        HttpEntity<Map<String, Object>> body =  createHttpEntity(requestBody);

        try {
            ResponseEntity<String> response = sendPostRequest(apiUrl, body);

            return objectMapper.readValue(response.getBody(), List.class);

        } catch (HttpClientErrorException e) {
            if (e.getStatusCode().is4xxClientError()) {
                throw new MovieNotFoundInDatabaseException();
            }
            throw e;
        } catch (Exception e) {
            logger.error("Error getting recommended movies with filters", e);
            return Collections.emptyList();
        }
    }

    public List<Movie> getRecommendedMoviesForMovieId(Integer movieId, String genre) throws MovieNotFoundInDatabaseException {
        List<Integer> movieIdsList = new LinkedList<>();
        movieIdsList.add(movieId);

        return getRecommendedMoviesForMovieIds(movieIdsList, genre);
    }

    public List<Movie> getRecommendedMoviesForMovieIds(List<Integer> movieIds, String genre) throws MovieNotFoundInDatabaseException {
        String apiUrl = apiUrlPython + "/recommend_movies_for_ids";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("movieIds", movieIds);
        addGenreToRequestIfNeeded(genre, requestBody);
        HttpEntity<Map<String, Object>> body = createHttpEntity(requestBody);

        try {
            ResponseEntity<String> response = sendPostRequest(apiUrl, body);

            Map<String, Object> responseMap = objectMapper.readValue(response.getBody(), Map.class);

            List<Map<String, Object>> movieMaps = (List<Map<String, Object>>) responseMap.get("recommended_movies");
            List<Movie> recommendedMovies = new ArrayList<>();

            for (Map<String, Object> movieMap : movieMaps) {
                Movie movie = objectMapper.convertValue(movieMap, Movie.class);
                recommendedMovies.add(movie);
            }

            return recommendedMovies;

        } catch (HttpClientErrorException e) {
            if (e.getStatusCode().is4xxClientError()) {
                throw new MovieNotFoundInDatabaseException();
            }
            throw e;
        } catch (Exception e) {
            logger.error("Error getting recommended movies", e);
            return Collections.emptyList();
        }
    }

    private ResponseEntity<String> sendPostRequest(String apiUrl, HttpEntity<Map<String, Object>> body) {
        return restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                body,
                String.class
        );
    }

    private static void addGenreToRequestIfNeeded(Object genre, Map<String, Object> requestBody) {
        if (genre != null) {
            requestBody.put("genre", genre);
        }
    }

    private static void addFiltersToRequestIfNeeded(Object filters, Map<String, Object> requestBody) {
        if (filters != null) {
            requestBody.put("filters", filters);
        }
    }

    private static HttpEntity<Map<String, Object>> createHttpEntity(Map<String, Object> requestBody) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        return new HttpEntity<>(requestBody, headers);
    }
}
