package org.moviesApp.Controllers.Helpers;

import org.moviesApp.Controllers.Models.ControllerResponse;
import org.moviesApp.Exceptions.InvalidCredentialsException;
import org.moviesApp.Exceptions.MovieNotFoundInDatabaseException;
import org.moviesApp.Exceptions.UserAlreadyExistsException;
import org.moviesApp.Exceptions.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ControllerResponse> handleUserNotFound(UserNotFoundException e) {
        logger.error("User not found", e);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ControllerResponse("User not found"));
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ControllerResponse> handleInvalidCredentials(InvalidCredentialsException e) {
        logger.error("Invalid credentials", e);

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ControllerResponse("Invalid credentials"));
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ControllerResponse> handleUserAlreadyExists(UserAlreadyExistsException e) {
        logger.error("User already exists", e);

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ControllerResponse("User with this login already exists"));
    }

    @ExceptionHandler(MovieNotFoundInDatabaseException.class)
    public ResponseEntity<ControllerResponse> handleMovieNotFoundInDatabase(MovieNotFoundInDatabaseException e) {
        logger.error("Movie Not Found In Database", e);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ControllerResponse("No movies found in the database"));
    }
}
