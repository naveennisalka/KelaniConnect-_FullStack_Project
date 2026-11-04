package com.example.kelani_media.repository;

import com.example.kelani_media.model.FriendRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends MongoRepository<FriendRequest, String> {
    
    // Find all incoming pending requests for a user
    List<FriendRequest> findByReceiverIdAndStatus(String receiverId, String status);

    // Find existing request between two users to prevent duplicate requests
    Optional<FriendRequest> findBySenderIdAndReceiverId(String senderId, String receiverId);

    // Count accepted friends for profile stats
    long countBySenderIdAndStatusOrReceiverIdAndStatus(String senderId, String status1, String receiverId, String status2);
}