package com.example.kelani_media.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** A new post on an event page. */
public record CreateEventPostRequest(
        @NotBlank String eventId,
        @NotBlank @Size(max = 5000) String content,
        @Size(max = 2_000_000) @Pattern(regexp = "^$|^(https?://|data:image/).+$") String imageUrl
) {
}
