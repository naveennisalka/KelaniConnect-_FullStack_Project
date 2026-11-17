package com.example.kelani_media.repository;

import com.example.kelani_media.model.JobApplication;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface JobApplicationRepository extends MongoRepository<JobApplication, String> {
    boolean existsByJobIdAndApplicantId(String jobId, String applicantId);
    List<JobApplication> findByApplicantIdOrderByCreatedAtDesc(String applicantId);
}
