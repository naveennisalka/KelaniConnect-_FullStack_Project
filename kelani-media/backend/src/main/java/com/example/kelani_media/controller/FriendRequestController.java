package com.example.kelani_media.controller;

import com.example.kelani_media.dto.FriendRequestSummary;
import com.example.kelani_media.dto.FriendStatsResponse;
import com.example.kelani_media.model.FriendRequest;
import com.example.kelani_media.model.User;
import com.example.kelani_media.repository.FriendRequestRepository;
import com.example.kelani_media.repository.UserRepository;
import com.example.kelani_media.service.CurrentUserService;
import com.example.kelani_media.service.FriendshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendRequestController {

    private final FriendRequestRepository friendRequestRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final FriendshipService friendshipService;

    @PostMapping("/request/send")
    public ResponseEntity<?> sendFriendRequest(
            @RequestParam String receiverId,
            Authentication authentication
    ) {
        User sender = currentUserService.require(authentication);
        FriendRequest saved = friendshipService.sendRequest(sender.getId(), receiverId);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/stats")
    public ResponseEntity<FriendStatsResponse> getStats(Authentication authentication) {
        User user = currentUserService.require(authentication);
        return ResponseEntity.ok(new FriendStatsResponse(friendshipService.countFriends(user.getId())));
    }

    @GetMapping("/requests/pending")
    public ResponseEntity<List<FriendRequestSummary>> getPendingRequests(Authentication authentication) {
        User receiver = currentUserService.require(authentication);
        List<FriendRequestSummary> requests = friendRequestRepository
                .findByReceiverIdAndStatus(receiver.getId(), "PENDING")
                .stream()
                .map(this::toSummary)
                .toList();
        return ResponseEntity.ok(requests);
    }

    @PutMapping("/request/accept/{requestId}")
    public ResponseEntity<?> acceptFriendRequest(
            @PathVariable String requestId,
            Authentication authentication
    ) {
        User receiver = currentUserService.require(authentication);
        friendshipService.acceptRequest(requestId, receiver.getId());
        return ResponseEntity.ok("Friend request accepted.");
    }

    @DeleteMapping("/request/reject/{requestId}")
    public ResponseEntity<?> rejectFriendRequest(
            @PathVariable String requestId,
            Authentication authentication
    ) {
        Optional<FriendRequest> requestOpt = friendRequestRepository.findById(requestId);
        if (requestOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        FriendRequest request = requestOpt.get();
        if (!request.getReceiverId().equals(currentUserService.require(authentication).getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You cannot change this friend request.");
        }

        friendRequestRepository.delete(request);
        return ResponseEntity.ok("Friend request deleted.");
    }

    private FriendRequestSummary toSummary(FriendRequest request) {
        User sender = userRepository.findById(request.getSenderId()).orElse(null);
        String senderName = sender == null
                ? null
                : (sender.getFirstName() + " " + sender.getLastName()).trim();

        return new FriendRequestSummary(
                request.getId(),
                request.getSenderId(),
                senderName,
                sender == null ? null : sender.getFaculty(),
                request.getStatus(),
                request.getCreatedAt()
        );
    }
}
