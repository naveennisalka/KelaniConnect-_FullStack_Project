package com.example.kelani_media.dto;

import com.example.kelani_media.model.User;

public record UserProfileResponse(
        String id,
        String firstName,
        String lastName,
        String faculty,
        String degreeProgram,
        String profilePicture,
        String bio
) {
    public static UserProfileResponse from(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getFaculty(),
                user.getDegreeProgram(),
                user.getProfilePicture(),
                user.getBio()
        );
    }
}
