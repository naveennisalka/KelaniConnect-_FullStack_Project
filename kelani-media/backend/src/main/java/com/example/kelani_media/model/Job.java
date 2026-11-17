package com.example.kelani_media.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "jobs")
public class Job {

    @Id
    private String id;

    private String title;
    private String society;
    private String location;
    private String stipend;
    private String description;
    private String imageUrl;
    private String createdBy;
    private String createdByName;
    private LocalDateTime createdAt = LocalDateTime.now();
}
