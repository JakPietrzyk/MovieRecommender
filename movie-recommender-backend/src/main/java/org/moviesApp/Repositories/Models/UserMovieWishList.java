package org.moviesApp.Repositories.Models;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_movie_wishList")
public class UserMovieWishList {
    public UserMovieWishList() {

    }

    public UserMovieWishList(Long userId, Integer movieId) {
        this.userId = userId;
        this.movieId = movieId;
        this.addedDate = LocalDateTime.now();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Integer movieId;

    private LocalDateTime addedDate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getMovieId() {
        return movieId;
    }

    public void setMovieId(Integer movieId) {
        this.movieId = movieId;
    }

    public void setAddedDate(LocalDateTime addedDate) {
        this.addedDate = addedDate;
    }
}
