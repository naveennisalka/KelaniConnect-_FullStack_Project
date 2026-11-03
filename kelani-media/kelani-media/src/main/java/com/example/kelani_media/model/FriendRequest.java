package com.example.kelani_media.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "friend_requests")
public class FriendRequest {

    @Id
    private String id;
    private String senderId;
    private String receiverId;
    private String status; // PENDING, ACCEPTED, REJECTED
    private LocalDateTime createdAt;

    public FriendRequest() {
        this.createdAt = LocalDateTime.now();
        this.status = "PENDING";
    }

    public FriendRequest(String senderId, String receiverId) {
        this();
        this.senderId = senderId;
        this.receiverId = receiverId;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }

    public String getReceiverId() { return receiverId; }
    public void setReceiverId(String receiverId) { this.receiverId = receiverId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}