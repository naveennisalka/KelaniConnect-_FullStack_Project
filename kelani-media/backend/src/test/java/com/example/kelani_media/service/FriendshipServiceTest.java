package com.example.kelani_media.service;

import com.example.kelani_media.model.FriendRequest;
import com.example.kelani_media.model.User;
import com.example.kelani_media.repository.FriendRequestRepository;
import com.example.kelani_media.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FriendshipServiceTest {

    @Mock
    private FriendRequestRepository friendRequestRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private FriendshipService friendshipService;

    @Test
    void suggestionsExcludePendingAndAcceptedRelationshipsInBothDirections() {
        FriendRequest sentPending = request("me", "pending-peer", "PENDING");
        FriendRequest receivedPending = request("received-peer", "me", "PENDING");
        FriendRequest acceptedFriend = request("me", "friend", "ACCEPTED");
        User self = user("me");

        when(friendRequestRepository.findBySenderIdAndStatusInOrReceiverIdAndStatusIn(
                "me", List.of("PENDING", "ACCEPTED"), "me", List.of("PENDING", "ACCEPTED")
        )).thenReturn(List.of(sentPending, receivedPending, acceptedFriend));
        when(userRepository.findAll()).thenReturn(List.of(
                self, user("pending-peer"), user("received-peer"), user("friend"), user("suggestion")
        ));

        List<User> suggestions = friendshipService.findSuggestions("me");

        assertEquals(List.of("suggestion"), suggestions.stream().map(User::getId).toList());
    }

    @Test
    void sendingRequestToExistingFriendOrPendingRequestIsRejected() {
        when(userRepository.existsById("peer")).thenReturn(true);
        when(friendRequestRepository.existsBySenderIdAndReceiverIdAndStatusIn(
                "me", "peer", List.of("PENDING", "ACCEPTED")
        )).thenReturn(true);

        assertThrows(ResponseStatusException.class, () -> friendshipService.sendRequest("me", "peer"));

        verify(friendRequestRepository, never()).save(org.mockito.ArgumentMatchers.any(FriendRequest.class));
        verify(friendRequestRepository).existsBySenderIdAndReceiverIdAndStatusIn(
                "me", "peer", List.of("PENDING", "ACCEPTED")
        );
        verify(friendRequestRepository, never()).existsBySenderIdAndReceiverIdAndStatusIn(
                "peer", "me", List.of("PENDING", "ACCEPTED")
        );
    }

    @Test
    void sendingRequestWhenTheOtherUserAlreadySentOneIsRejected() {
        when(userRepository.existsById("peer")).thenReturn(true);
        when(friendRequestRepository.existsBySenderIdAndReceiverIdAndStatusIn(
                "me", "peer", List.of("PENDING", "ACCEPTED")
        )).thenReturn(false);
        when(friendRequestRepository.existsBySenderIdAndReceiverIdAndStatusIn(
                "peer", "me", List.of("PENDING", "ACCEPTED")
        )).thenReturn(true);

        assertThrows(ResponseStatusException.class, () -> friendshipService.sendRequest("me", "peer"));

        verify(friendRequestRepository, never()).save(org.mockito.ArgumentMatchers.any(FriendRequest.class));
    }

    private FriendRequest request(String senderId, String receiverId, String status) {
        FriendRequest request = new FriendRequest(senderId, receiverId);
        request.setStatus(status);
        return request;
    }

    private User user(String id) {
        return User.builder().id(id).build();
    }
}
