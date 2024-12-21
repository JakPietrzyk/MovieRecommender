package org.moviesApp.Services;

import org.moviesApp.Exceptions.InvalidCredentialsException;
import org.moviesApp.Exceptions.UserAlreadyExistsException;
import org.moviesApp.Repositories.Models.User;
import org.moviesApp.Repositories.UserRepository;
import org.moviesApp.Exceptions.UserNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoginServiceTests {

    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private LoginService loginService;
    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setLogin("login");
        user.setPassword("password");
    }

    @Test
    void shouldCreateNewUser() throws UserAlreadyExistsException {
        when(userRepository.save(user)).thenReturn(user);

        boolean result = loginService.createUserInDatabase(user);

        assertTrue(result);
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void shouldThrowIfUserAlreadyExists()
    {
        when(userRepository.findByLogin(user.getLogin())).thenReturn(Optional.of(user));

        assertThrows(UserAlreadyExistsException.class, () -> loginService.createUserInDatabase(user));
    }

    @Test
    void shouldReturnFoundUser() {
        when(userRepository.findByLogin("login")).thenReturn(Optional.of(user));

        Optional<User> foundUser = loginService.findUserByLogin("login");

        assertTrue(foundUser.isPresent());
        assertEquals("login", foundUser.get().getLogin());
        verify(userRepository, times(1)).findByLogin("login");
    }

    @Test
    void shouldLoginForCorrectCredentials() throws UserNotFoundException, InvalidCredentialsException {
        when(userRepository.findByLogin(user.getLogin())).thenReturn(Optional.of(user));

        User returnedUser = loginService.tryLoginUser(user);

        assertNotNull(returnedUser);
    }

    @Test
    void shouldFailLoginForWrongPassword() {
        User dbUser = new User();
        dbUser.setLogin("login");
        dbUser.setPassword("wrongPassword");

        when(userRepository.findByLogin(user.getLogin())).thenReturn(Optional.of(dbUser));

        assertThrows(InvalidCredentialsException.class, () -> loginService.tryLoginUser(user));
    }

    @Test
    void shouldThrowForInvalidLogin() {
        when(userRepository.findByLogin("login")).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> loginService.tryLoginUser(user));
    }
}
