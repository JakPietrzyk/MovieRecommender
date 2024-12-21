package org.moviesApp.Repositories.Models;

import jakarta.persistence.*;

@Entity
@Table(name = "movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String title;
    private String genres;
    private String release_date;
    private Float rating;
    @Column(length = 1000)
    private String production_companies;
    private Float popularity;
    private Float vote_average;
    private Integer vote_count;
    private Long budget;
    @Column(length = 1000)
    private String overview;
    private Integer runtime;
    private String poster_path;


    public Integer getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getGenres() {
        return genres;
    }



    public Float getRating() {
        return rating;
    }

    public String getProduction_companies() {
        return production_companies;
    }

    public Float getPopularity() {
        return popularity;
    }

    public Float getVote_average() {
        return vote_average;
    }

    public Integer getVote_count() {
        return vote_count;
    }

    public Long getBudget() {
        return budget;
    }

    public String getOverview() {
        return overview;
    }

    public Integer getRuntime() {
        return runtime;
    }

    public String getPoster_path() {
        return poster_path;
    }

    public String getRelease_date() {
        return release_date;
    }
}