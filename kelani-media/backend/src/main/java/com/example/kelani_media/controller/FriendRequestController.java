package com.example.kelani_media.controller;

import com.example.kelani_media.dto.FriendRequestSummary;
import com.example.kelani_media.model.FriendRequest;
import com.example.kelani_media.model.User;
import com.example.kelani_media.repository.FriendRequestRepository;
import com.example.kelani_media.repository.UserRepository;
import com.example.kelani_media.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendRequestController {

    private final FriendRequestRepository friendRequestRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    @PostMapping("/request/send")
    public ResponseEntity<?> sendFriendRequest(
            @RequestParam String receiverId,
            Authentication authentication
    ) {
        User sender = currentUserService.require(authentication);
        if (sender.getId().equals(receiverId)) {
            return ResponseEntity.badRequest().body("You cannot send a friend request to yourself.");
        }
        if (!userRepository.existsById(receiverId)) {
            return ResponseEntity.notFound().build();
        }

        Optional<FriendRequest> existing = friendRequestRepository
                .findBySenderIdAndReceiverId(sender.getId(), receiverId);
        Optional<FriendRequest> reverse = friendRequestRepository
                .findBySenderIdAndReceiverId(receiverId, sender.getId());
        if (existing.isPresent() || reverse.isPresent()) {
            return ResponseEntity.badRequest().body("A friend request already exists between these users.");
        }

        FriendRequest saved = friendRequestRepository.save(new FriendRequest(sender.getId(), receiverId));
        return ResponseEntity.ok(saved);
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
        Optional<FriendRequest> requestOpt = friendRequestRepository.findById(requestId);
        if (requestOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        FriendRequest request = requestOpt.get();
        if (!Objects.equals(request.getReceiverId(), currentUserService.require(authentication).getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You cannot change this friend request.");
        }

        request.setStatus("ACCEPTED");
        friendRequestRepository.save(request);
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
        if (!Objects.equals(request.getReceiverId(), currentUserService.require(authentication).getId())) {
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
