package org.moviesApp.Repositories;

import jakarta.transaction.Transactional;
import org.moviesApp.Repositories.Models.UserMovieWishList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserMovieWishListRepository extends JpaRepository<UserMovieWishList, Long> {
    List<UserMovieWishList> findByUserId(Long userId);
    @Transactional
    void deleteByUserIdAndMovieId(Long userId, Long movieId);
    boolean existsByUserIdAndMovieId(Long userId, Long movieId);
}
