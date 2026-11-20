package com.example.kelani_media.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@Document(collection = "posts")
public class Post {

    @Id
    private String id;

    private String authorId;
    private String authorName;
    private String faculty;
    private String content;
    private String tag;
    private String mediaUrl;
    private List<String> likedBy = new ArrayList<>();
    private List<Comment> comments = new ArrayList<>();
    private LocalDateTime createdAt = LocalDateTime.now();

    @Data
    @NoArgsConstructor
    public static class Comment {
        private String id = UUID.randomUUID().toString();
        private String authorId;
        private String authorName;
        private String content;
        private LocalDateTime createdAt = LocalDateTime.now();
        private List<Comment> replies = new ArrayList<>();

        public Comment(String authorId, String authorName, String content) {
            this.authorId = authorId;
            this.authorName = authorName;
            this.content = content;
        }
    }
}
