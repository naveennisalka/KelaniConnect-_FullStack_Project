package com.example.kelani_media.controller;

import com.example.kelani_media.dto.UserProfileResponse;
import com.example.kelani_media.dto.UpdateProfileRequest;
import com.example.kelani_media.model.User;
import com.example.kelani_media.repository.UserRepository;
import com.example.kelani_media.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    @GetMapping("/discover")
    public List<UserProfileResponse> discover(Authentication authentication) {
        User currentUser = currentUserService.require(authentication);
        return userRepository.findAll().stream()
                .filter(user -> !user.getId().equals(currentUser.getId()))
                .map(UserProfileResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public UserProfileResponse getProfile(@PathVariable String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return UserProfileResponse.from(user);
    }

    @PutMapping("/me")
    public UserProfileResponse updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        User user = currentUserService.require(authentication);
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setBio(request.bio());
        user.setProfilePicture(request.profilePicture());
        user.setFaculty(request.faculty());
        user.setDegreeProgram(request.degreeProgram());
        user.setUpdatedAt(java.time.LocalDateTime.now());
        return UserProfileResponse.from(userRepository.save(user));
    }
}
