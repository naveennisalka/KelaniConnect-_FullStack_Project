package com.example.kelani_media.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateJobRequest(
        @NotBlank @Size(max = 160) String title,
        @NotBlank @Size(max = 160) String society,
        @NotBlank @Size(max = 160) String location,
        @NotBlank @Size(max = 80) String stipend,
        @NotBlank @Size(max = 5000) String description,
        @Size(max = 2048) @Pattern(regexp = "^$|^https?://.+$") String imageUrl
) {
}
