package com.example.kelani_media.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Used by organizers to change the event profile photo or cover photo.
 * Send only the photo you want to change, leave the other one null.
 */
public record UpdateEventPhotosRequest(
        @Size(max = 2_000_000) @Pattern(regexp = "^$|^(https?://|data:image/).+$") String profilePhoto,
        @Size(max = 2_000_000) @Pattern(regexp = "^$|^(https?://|data:image/).+$") String coverPhoto
) {
}
