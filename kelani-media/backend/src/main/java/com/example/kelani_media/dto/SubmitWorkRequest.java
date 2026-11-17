package com.example.kelani_media.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SubmitWorkRequest(
        @NotBlank @Size(max = 2048) @Pattern(regexp = "^https?://.+$") String submissionUrl,
        @Size(max = 2000) String comment
) {
}
