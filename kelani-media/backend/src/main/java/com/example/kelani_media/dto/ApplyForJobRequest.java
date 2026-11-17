package com.example.kelani_media.dto;

import jakarta.validation.constraints.Size;

public record ApplyForJobRequest(@Size(max = 3000) String coverLetter) {
}
