package com.example.kelani_media.dto;

import jakarta.validation.constraints.NotBlank;

/** Used to add an organizer to an event or to invite a member. */
public record EventMemberRequest(@NotBlank String userId) {
}
