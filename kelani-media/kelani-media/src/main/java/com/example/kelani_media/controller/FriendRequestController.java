package com.example.kelani_media.controller;

import com.example.kelani_media.model.FriendRequest;
import com.example.kelani_media.repository.FriendRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin(origins = "http://localhost:5173")
public class FriendRequestController {

    @Autowired
    private FriendRequestRepository friendRequestRepository;

    // Send a Friend Request ("Add Friend" button)
    @PostMapping("/request/send")
    public ResponseEntity<?> sendFriendRequest(@RequestParam String senderId, @RequestParam String receiverId) {
        Optional<FriendRequest> existing = friendRequestRepository.findBySenderIdAndReceiverId(senderId, receiverId);
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("Friend request already sent.");
        }

        FriendRequest request = new FriendRequest(senderId, receiverId);
        FriendRequest saved = friendRequestRepository.save(request);
        return ResponseEntity.ok(saved);
    }

    // Get Pending Friend Requests for Logged-in User ("Request" tab list)
    @GetMapping("/requests/pending/{userId}")
    public ResponseEntity<List<FriendRequest>> getPendingRequests(@PathVariable String userId) {
        List<FriendRequest> pending = friendRequestRepository.findByReceiverIdAndStatus(userId, "PENDING");
        return ResponseEntity.ok(pending);
    }

    // Accept Friend Request ("Confirm" button)
    @PutMapping("/request/accept/{requestId}")
    public ResponseEntity<?> acceptFriendRequest(@PathVariable String requestId) {
        Optional<FriendRequest> requestOpt = friendRequestRepository.findById(requestId);
        if (requestOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        FriendRequest request = requestOpt.get();
        request.setStatus("ACCEPTED");
        friendRequestRepository.save(request);
        return ResponseEntity.ok("Friend request accepted.");
    }

    // Reject/Delete Friend Request ("Delete" button)
    @DeleteMapping("/request/reject/{requestId}")
    public ResponseEntity<?> rejectFriendRequest(@PathVariable String requestId) {
        if (!friendRequestRepository.existsById(requestId)) {
            return ResponseEntity.notFound().build();
        }
        friendRequestRepository.deleteById(requestId);
        return ResponseEntity.ok("Friend request deleted.");
    }
}