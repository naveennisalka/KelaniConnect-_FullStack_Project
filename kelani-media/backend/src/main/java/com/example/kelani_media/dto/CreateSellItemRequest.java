package com.example.kelani_media.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

/** A ticket or other item that an organizer wants to sell on the event page. */
public record CreateSellItemRequest(
        @NotBlank @Size(max = 120) String name,
        @Size(max = 1000) String description,
        @PositiveOrZero double price,
        @Size(max = 2_000_000) @Pattern(regexp = "^$|^(https?://|data:image/).+$") String imageUrl
) {
}
