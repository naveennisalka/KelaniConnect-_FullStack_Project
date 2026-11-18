package com.example.kelani_media.repository;

import com.example.kelani_media.model.FriendRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface FriendRequestRepository extends MongoRepository<FriendRequest, String> {

    List<FriendRequest> findByReceiverIdAndStatus(String receiverId, String status);

    List<FriendRequest> findBySenderIdAndStatusInOrReceiverIdAndStatusIn(
            String senderId,
            Collection<String> senderStatuses,
            String receiverId,
            Collection<String> receiverStatuses
    );

    boolean existsBySenderIdAndReceiverIdAndStatusIn(
            String senderId,
            String receiverId,
            Collection<String> statuses
    );

    // Count accepted friends for profile stats
    long countBySenderIdAndStatusOrReceiverIdAndStatus(String senderId, String status1, String receiverId, String status2);
}