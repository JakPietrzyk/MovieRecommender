package org.moviesApp.Services;

import org.moviesApp.Repositories.Models.UserMovieWishList;
import org.moviesApp.Repositories.UserMovieWishListRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MovieServiceTests {

    @Mock
    private UserMovieWishListRepository userMovieListRepository;

    @InjectMocks
    private MovieService movieService;

    @Test
    void shouldAddMovieToWishList() {
        Long userId = 1L;
        Integer movieId = 2;

        movieService.addMovieToUserList(userId, movieId);

        verify(userMovieListRepository, times(1)).save(any(UserMovieWishList.class));
    }

    @Test
    void shouldRemoveMovieFromWishList() {
        Long userId = 1L;
        Long movieId = 2L;

        movieService.removeMovieFromUserList(userId, movieId);

        verify(userMovieListRepository, times(1)).deleteByUserIdAndMovieId(userId, movieId);
    }

    @Test
    void shouldReturnUserMoviesWishList() {
        Long userId = 1L;
        UserMovieWishList wishList1 = new UserMovieWishList(userId, 1);
        UserMovieWishList wishList2 = new UserMovieWishList(userId, 2);

        when(userMovieListRepository.findByUserId(userId)).thenReturn(Arrays.asList(wishList1, wishList2));

        List<Integer> userMovies = movieService.getUserMoviesIds(userId);

        assertEquals(2, userMovies.size());
        assertTrue(userMovies.contains(1));
        assertTrue(userMovies.contains(2));
    }

    @Test
    void shouldReturnTrueForMovieInUserWishlist() {
        Long userId = 1L;
        Long movieId = 2L;

        when(userMovieListRepository.existsByUserIdAndMovieId(userId, movieId)).thenReturn(true);

        boolean result = movieService.isMovieInUserWishlist(userId, movieId);

        assertTrue(result);
        verify(userMovieListRepository, times(1)).existsByUserIdAndMovieId(userId, movieId);
    }
}
