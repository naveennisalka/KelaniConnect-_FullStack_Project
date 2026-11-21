package com.example.kelani_media.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Data sent by the "Create Event" wizard.
 * Photos can be an image link (https://...) or an uploaded image ("data:image/...").
 * 2,000,000 characters is about a 1.4 MB image, the frontend makes images smaller before sending.
 */
public record CreateEventRequest(
        @NotBlank @Size(max = 160) String title,
        @NotBlank @Size(max = 5000) String description,
        @NotBlank @Size(max = 160) String location,
        @NotNull LocalDateTime startsAt,
        @Size(max = 2_000_000) @Pattern(regexp = "^$|^(https?://|data:image/).+$") String profilePhoto,
        @Size(max = 2_000_000) @Pattern(regexp = "^$|^(https?://|data:image/).+$") String coverPhoto,
        @Size(max = 20) List<String> organizerIds
) {
}
