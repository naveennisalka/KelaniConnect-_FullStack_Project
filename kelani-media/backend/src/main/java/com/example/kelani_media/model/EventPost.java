package com.example.kelani_media.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * A post published on an event page by one of the event organizers.
 * We keep these separate from normal posts so they only show on the event page and the events feed.
 */
@Data
@NoArgsConstructor
@Document(collection = "event_posts")
public class EventPost {

    @Id
    private String id;

    private String eventId;
    private String eventTitle;

    private String authorId;
    private String authorName;

    private String content;
    private String imageUrl;

    private List<String> likedBy = new ArrayList<>();
    // We reuse the same Comment class that normal posts use
    private List<Post.Comment> comments = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();
}
