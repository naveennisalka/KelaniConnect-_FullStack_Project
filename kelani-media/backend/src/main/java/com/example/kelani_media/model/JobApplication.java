package com.example.kelani_media.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "job_applications")
public class JobApplication {

    @Id
    private String id;

    private String jobId;
    private String jobTitle;
    private String applicantId;
    private String applicantName;
    private String status = "ONGOING";
    private String coverLetter;
    private String submissionUrl;
    private String submissionComment;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
