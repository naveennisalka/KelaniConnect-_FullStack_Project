package com.example.kelani_media.dto;

import java.time.LocalDateTime;

public record FriendRequestSummary(
        String id,
        String senderId,
        String senderName,
        String faculty,
        String status,
        LocalDateTime createdAt
) {
}
