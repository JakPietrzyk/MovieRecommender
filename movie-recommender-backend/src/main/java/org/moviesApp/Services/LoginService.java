package org.moviesApp.Services;

import org.moviesApp.Exceptions.InvalidCredentialsException;
import org.moviesApp.Exceptions.UserAlreadyExistsException;
import org.moviesApp.Repositories.Models.User;
import org.moviesApp.Repositories.UserRepository;
import org.moviesApp.Exceptions.UserNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginService {
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(LoginService.class);

    @Autowired
    public LoginService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean createUserInDatabase(User newUser) throws UserAlreadyExistsException {
        if (isUserAlreadyRegistered(newUser)) {
            throw new UserAlreadyExistsException();
        }

        try {
            userRepository.save(newUser);
            return true;
        } catch (Exception e) {
            logger.error("Error creating new user. User with login {} already exists", newUser.getLogin());
            throw new UserAlreadyExistsException();
        }
    }

    private boolean isUserAlreadyRegistered(User user) {
        Optional<User> existingUser = userRepository.findByLogin(user.getLogin());

        return existingUser.isPresent();
    }

    public Optional<User> findUserByLogin(String login) {
        return userRepository.findByLogin(login);
    }

    public User tryLoginUser(User userToLogin) throws UserNotFoundException, InvalidCredentialsException {
        Optional<User> userFromDatabase = findUserByLogin(userToLogin.getLogin());

        if (userFromDatabase.isEmpty()) {
            throw new UserNotFoundException();
        }

        validateUserCredentials(userToLogin, userFromDatabase.get());

        return userFromDatabase.get();
    }

    private void validateUserCredentials(User userCredentials, User userCredentialsFromDatabase) throws InvalidCredentialsException {
        if(!areCredentialsEqual(userCredentials, userCredentialsFromDatabase))
        {
            throw new InvalidCredentialsException();
        }
    }

    private boolean areCredentialsEqual(User userCredentials, User userCredentialsFromDatabase) {
        return isUserPasswordEqual(userCredentials, userCredentialsFromDatabase) && isUserLoginEqual(userCredentials, userCredentialsFromDatabase);
    }

    private boolean isUserPasswordEqual(User userCredentials, User userCredentialsFromDatabase) {
        String userPasswordFromDatabase = userCredentialsFromDatabase.getPassword();

        return userPasswordFromDatabase.equals(userCredentials.getPassword());
    }

    private boolean isUserLoginEqual(User userCredentials, User userCredentialsFromDatabase) {
        String userLoginFromDatabase = userCredentialsFromDatabase.getLogin();

        return userLoginFromDatabase.equals(userCredentials.getLogin());
    }
}
