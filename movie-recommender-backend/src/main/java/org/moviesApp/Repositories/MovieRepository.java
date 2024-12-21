package org.moviesApp.Repositories;

import org.moviesApp.Repositories.Models.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
}
