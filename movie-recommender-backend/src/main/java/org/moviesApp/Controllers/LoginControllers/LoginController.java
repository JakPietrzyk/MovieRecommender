package org.moviesApp.Controllers.LoginControllers;

import org.moviesApp.Controllers.Models.ControllerResponse;
import org.moviesApp.Exceptions.InvalidCredentialsException;
import org.moviesApp.Exceptions.UserAlreadyExistsException;
import org.moviesApp.Repositories.Models.User;
import org.moviesApp.Exceptions.UserNotFoundException;
import org.moviesApp.Services.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class LoginController {
    private final LoginService loginService;

    @Autowired
    LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/register")
    public ResponseEntity<ControllerResponse> createUser(@RequestBody User user) throws UserAlreadyExistsException {
        loginService.createUserInDatabase(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ControllerResponse("User created successfully"));
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User userToLogin) throws UserNotFoundException, InvalidCredentialsException {
            User userData = loginService.tryLoginUser(userToLogin);

            return ResponseEntity.ok(userData);
    }
}
