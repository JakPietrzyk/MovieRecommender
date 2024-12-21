package org.moviesApp.Services;

import jakarta.transaction.Transactional;
import org.moviesApp.Clients.MoviesClient;
import org.moviesApp.Repositories.Models.Movie;
import org.moviesApp.Repositories.Models.UserMovieWishList;
import org.moviesApp.Repositories.UserMovieWishListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovieService {
    private final UserMovieWishListRepository userMovieListRepository;
    private final MoviesClient moviesClient;

    @Autowired
    public MovieService(UserMovieWishListRepository userMovieListRepository, MoviesClient moviesClient) {
        this.userMovieListRepository = userMovieListRepository;
        this.moviesClient = moviesClient;
    }

    public void addMovieToUserList(Long userId, Integer movieId) {
        UserMovieWishList userMovieList = new UserMovieWishList(userId, movieId);

        userMovieListRepository.save(userMovieList);
    }

    @Transactional
    public void removeMovieFromUserList(Long userId, Long movieId) {
        userMovieListRepository.deleteByUserIdAndMovieId(userId, movieId);
    }


    public List<Integer> getUserMoviesIds(Long userId) {
        List<UserMovieWishList> userMovieLists = userMovieListRepository.findByUserId(userId);

        var userMoviesIds = new ArrayList<>(userMovieLists.stream()
                .map(UserMovieWishList::getMovieId)
                .toList());
        Collections.shuffle(userMoviesIds);

        return userMoviesIds;
    }

    private List<Movie> getUserMovies(Long userId) {
        List<Integer> userMoviesIds = getUserMoviesIds(userId);

        List<Movie> userMovies = new ArrayList<>(moviesClient.getMoviesByIds(userMoviesIds));
        Collections.shuffle(userMovies);

        return userMovies;
    }


    public List<String> getUserMovieGenres(Long userId) {
        List<Movie> userMovies = getUserMovies(userId);

        List<String> genreNames = userMovies.stream()
                .flatMap(movie -> Arrays.stream(movie.getGenres().split(",\\s*")))
                .distinct()
                .collect(Collectors.toList());

        Collections.shuffle(genreNames);

        return genreNames;
    }


    public boolean isMovieInUserWishlist(Long userId, Long movieId) {
        return userMovieListRepository.existsByUserIdAndMovieId(userId, movieId);
    }
}

