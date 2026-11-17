package com.example.kelani_media.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreatePostRequest(
        @NotBlank @Size(max = 5000) String content,
        @Size(max = 80) String tag,
        @Size(max = 2048) @Pattern(regexp = "^$|^https?://.+$") String mediaUrl
) {
}
