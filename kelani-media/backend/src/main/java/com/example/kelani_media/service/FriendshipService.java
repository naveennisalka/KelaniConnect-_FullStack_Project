package com.example.kelani_media.service;

import com.example.kelani_media.model.FriendRequest;
import com.example.kelani_media.model.User;
import com.example.kelani_media.repository.FriendRequestRepository;
import com.example.kelani_media.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendshipService {

    private static final List<String> ACTIVE_STATUSES = List.of("PENDING", "ACCEPTED");

    private final FriendRequestRepository friendRequestRepository;
    private final UserRepository userRepository;

    public List<User> findSuggestions(String userId) {
        Set<String> relatedUserIds = friendRequestRepository
                .findBySenderIdAndStatusInOrReceiverIdAndStatusIn(
                        userId,
                        ACTIVE_STATUSES,
                        userId,
                        ACTIVE_STATUSES
                )
                .stream()
                .map(request -> request.getSenderId().equals(userId)
                        ? request.getReceiverId()
                        : request.getSenderId())
                .collect(Collectors.toSet());

        return userRepository.findAll().stream()
                .filter(user -> !user.getId().equals(userId))
                .filter(user -> !relatedUserIds.contains(user.getId()))
                .toList();
    }

    public FriendRequest sendRequest(String senderId, String receiverId) {
        if (senderId.equals(receiverId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot send a friend request to yourself.");
        }
        if (!userRepository.existsById(receiverId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");
        }

        if (hasActiveRelationship(senderId, receiverId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A friend request is already pending or these users are already friends."
            );
        }

        return friendRequestRepository.save(new FriendRequest(senderId, receiverId));
    }

    public FriendRequest acceptRequest(String requestId, String receiverId) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Friend request not found."));
        if (!request.getReceiverId().equals(receiverId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot change this friend request.");
        }
        if (!"PENDING".equals(request.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This friend request is no longer pending.");
        }

        request.setStatus("ACCEPTED");
        return friendRequestRepository.save(request);
    }

    public long countFriends(String userId) {
        return friendRequestRepository.countBySenderIdAndStatusOrReceiverIdAndStatus(
                userId,
                "ACCEPTED",
                userId,
                "ACCEPTED"
        );
    }

    private boolean hasActiveRelationship(String firstUserId, String secondUserId) {
        return friendRequestRepository.existsBySenderIdAndReceiverIdAndStatusIn(
                firstUserId,
                secondUserId,
                ACTIVE_STATUSES
        ) || friendRequestRepository.existsBySenderIdAndReceiverIdAndStatusIn(
                secondUserId,
                firstUserId,
                ACTIVE_STATUSES
        );
    }
}
