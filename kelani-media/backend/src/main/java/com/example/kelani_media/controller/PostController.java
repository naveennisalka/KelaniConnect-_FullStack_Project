package com.example.kelani_media.controller;

import com.example.kelani_media.dto.CreateCommentRequest;
import com.example.kelani_media.dto.CreatePostRequest;
import com.example.kelani_media.model.Post;
import com.example.kelani_media.model.User;
import com.example.kelani_media.repository.PostRepository;
import com.example.kelani_media.service.CurrentUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostRepository postRepository;
    private final CurrentUserService currentUserService;

    @GetMapping
    public List<Post> getFeed() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public Post createPost(Authentication authentication, @Valid @RequestBody CreatePostRequest request) {
        User author = currentUserService.require(authentication);
        Post post = new Post();
        post.setAuthorId(author.getId());
        post.setAuthorName((author.getFirstName() + " " + author.getLastName()).trim());
        post.setFaculty(author.getFaculty());
        post.setContent(request.content().trim());
        post.setTag(request.tag() == null || request.tag().isBlank() ? "Campus Life" : request.tag().trim());
        post.setMediaUrl(blankToNull(request.mediaUrl()));
        return postRepository.save(post);
    }

    @PostMapping("/{postId}/likes")
    public Post toggleLike(Authentication authentication, @PathVariable String postId) {
        User user = currentUserService.require(authentication);
        Post post = findPost(postId);
        if (post.getLikedBy().contains(user.getId())) {
            post.getLikedBy().remove(user.getId());
        } else {
            post.getLikedBy().add(user.getId());
        }
        return postRepository.save(post);
    }

    @PostMapping("/{postId}/comments")
    public Post addComment(
            Authentication authentication,
            @PathVariable String postId,
            @Valid @RequestBody CreateCommentRequest request
    ) {
        User author = currentUserService.require(authentication);
        Post post = findPost(postId);
        post.getComments().add(new Post.Comment(
                author.getId(),
                (author.getFirstName() + " " + author.getLastName()).trim(),
                request.content().trim()
        ));
        return postRepository.save(post);
    }

    @PostMapping("/{postId}/comments/{commentId}/replies")
    public Post addReply(
            Authentication authentication,
            @PathVariable String postId,
            @PathVariable String commentId,
            @Valid @RequestBody CreateCommentRequest request
    ) {
        User author = currentUserService.require(authentication);
        Post post = findPost(postId);
        Post.Comment comment = post.getComments().stream()
                .filter(item -> commentId.equals(item.getId()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
        if (comment.getReplies() == null) {
            comment.setReplies(new ArrayList<>());
        }
        comment.getReplies().add(new Post.Comment(
                author.getId(),
                (author.getFirstName() + " " + author.getLastName()).trim(),
                request.content().trim()
        ));
        return postRepository.save(post);
    }

    private Post findPost(String postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
