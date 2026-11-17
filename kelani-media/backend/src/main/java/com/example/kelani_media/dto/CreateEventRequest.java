package com.example.kelani_media.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record CreateEventRequest(
        @NotBlank @Size(max = 160) String title,
        @NotBlank @Size(max = 160) String organizer,
        @NotBlank @Size(max = 160) String location,
        @NotBlank @Size(max = 5000) String description,
        @NotNull LocalDateTime startsAt,
        @Size(max = 2048) @Pattern(regexp = "^$|^https?://.+$") String imageUrl
) {
}
