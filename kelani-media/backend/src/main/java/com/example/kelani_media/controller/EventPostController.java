package com.example.kelani_media.controller;

import com.example.kelani_media.dto.CreateCommentRequest;
import com.example.kelani_media.dto.CreateEventPostRequest;
import com.example.kelani_media.exception.ApiException;
import com.example.kelani_media.model.CampusEvent;
import com.example.kelani_media.model.EventPost;
import com.example.kelani_media.model.Post;
import com.example.kelani_media.model.User;
import com.example.kelani_media.repository.EventPostRepository;
import com.example.kelani_media.service.CurrentUserService;
import com.example.kelani_media.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.example.kelani_media.service.EventService.blankToNull;
import static com.example.kelani_media.service.EventService.fullName;

/**
 * REST API for posts on event pages.
 *
 * GET  /api/event-posts                    -> all event posts (events feed)
 * GET  /api/event-posts?eventId=123        -> posts of one event (event page)
 * POST /api/event-posts                    -> create a post (organizers only)
 * POST /api/event-posts/{postId}/likes     -> like / unlike
 * POST /api/event-posts/{postId}/comments  -> add a comment
 */
@RestController
@RequestMapping("/api/event-posts")
@RequiredArgsConstructor
public class EventPostController {

    private final EventPostRepository eventPostRepository;
    private final CurrentUserService currentUserService;
    private final EventService eventService;

    @GetMapping
    public List<EventPost> getPosts(@RequestParam(required = false) String eventId) {
        if (eventId == null || eventId.isBlank()) {
            return eventPostRepository.findAllByOrderByCreatedAtDesc();
        }
        return eventPostRepository.findByEventIdOrderByCreatedAtDesc(eventId);
    }

    @PostMapping
    public EventPost createPost(Authentication authentication, @Valid @RequestBody CreateEventPostRequest request) {
        User author = currentUserService.require(authentication);
        CampusEvent event = eventService.findEvent(request.eventId());
        eventService.requireOrganizer(event, author);

        EventPost post = new EventPost();
        post.setEventId(event.getId());
        post.setEventTitle(event.getTitle());
        post.setAuthorId(author.getId());
        post.setAuthorName(fullName(author));
        post.setContent(request.content().trim());
        post.setImageUrl(blankToNull(request.imageUrl()));
        return eventPostRepository.save(post);
    }

    @PostMapping("/{postId}/likes")
    public EventPost toggleLike(Authentication authentication, @PathVariable String postId) {
        User user = currentUserService.require(authentication);
        EventPost post = findPost(postId);

        if (post.getLikedBy().contains(user.getId())) {
            post.getLikedBy().remove(user.getId());
        } else {
            post.getLikedBy().add(user.getId());
        }
        return eventPostRepository.save(post);
    }

    @PostMapping("/{postId}/comments")
    public EventPost addComment(
            Authentication authentication,
            @PathVariable String postId,
            @Valid @RequestBody CreateCommentRequest request
    ) {
        User author = currentUserService.require(authentication);
        EventPost post = findPost(postId);
        post.getComments().add(new Post.Comment(author.getId(), fullName(author), request.content().trim()));
        return eventPostRepository.save(post);
    }

    private EventPost findPost(String postId) {
        return eventPostRepository.findById(postId)
                .orElseThrow(() -> new ApiException("Post not found", HttpStatus.NOT_FOUND));
    }
}
