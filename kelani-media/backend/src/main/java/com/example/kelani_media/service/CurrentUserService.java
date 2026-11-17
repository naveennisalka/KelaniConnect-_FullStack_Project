package com.example.kelani_media.service;

import com.example.kelani_media.model.User;
import com.example.kelani_media.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class CurrentUserService {

    private final UserRepository userRepository;

    public User require(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public boolean hasAnyRole(User user, String... roles) {
        return user.getRoles() != null
                && Arrays.stream(roles).anyMatch(user.getRoles()::contains);
    }

    public void requireAnyRole(User user, String... roles) {
        if (!hasAnyRole(user, roles)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to perform this action");
        }
    }
}
