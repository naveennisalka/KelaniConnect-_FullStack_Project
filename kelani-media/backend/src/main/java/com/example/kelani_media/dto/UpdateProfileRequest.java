package com.example.kelani_media.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank @Size(max = 80) String firstName,
        @NotBlank @Size(max = 80) String lastName,
        @Size(max = 500) String bio,
        @Size(max = 2048) @Pattern(regexp = "^$|^https?://.+$") String profilePicture,
        @Size(max = 120) String faculty,
        @Size(max = 160) String degreeProgram
) {
}
