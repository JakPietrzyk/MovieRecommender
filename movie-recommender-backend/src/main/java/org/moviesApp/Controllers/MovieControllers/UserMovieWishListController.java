package org.moviesApp.Controllers.MovieControllers;

import org.moviesApp.Services.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishList")
public class UserMovieWishListController {
    private final MovieService movieService;

    @Autowired
    public UserMovieWishListController(MovieService movieService) {
        this.movieService = movieService;
    }

    @PostMapping("/user/{userId}/add/{movieId}")
    public ResponseEntity<Void> addMovieToUserList(@PathVariable Long userId, @PathVariable Integer movieId) {
        movieService.addMovieToUserList(userId, movieId);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/user/{userId}/remove/{movieId}")
    public ResponseEntity<Void> removeMovieFromUserList(@PathVariable Long userId, @PathVariable Long movieId) {
        movieService.removeMovieFromUserList(userId, movieId);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Integer>> getUserMovies(@PathVariable Long userId) {
        return ResponseEntity.ok(movieService.getUserMoviesIds(userId));
    }

    @GetMapping("/check/{userId}/{movieId}")
    public ResponseEntity<Boolean> checkMovieExistsInWishlist(@PathVariable Long userId, @PathVariable Long movieId) {
        boolean exists = movieService.isMovieInUserWishlist(userId, movieId);

        return ResponseEntity.ok(exists);
    }
}
