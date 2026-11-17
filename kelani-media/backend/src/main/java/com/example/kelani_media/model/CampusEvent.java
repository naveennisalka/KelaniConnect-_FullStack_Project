package com.example.kelani_media.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "events")
public class CampusEvent {

    @Id
    private String id;

    private String title;
    private String description;
    private String organizer;
    private String organizerId;
    private String organizerName;
    private String location;
    private LocalDateTime startsAt;
    private String imageUrl;
    private LocalDateTime createdAt = LocalDateTime.now();
}
