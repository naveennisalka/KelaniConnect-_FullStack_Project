package com.example.kelani_media.repository;

import com.example.kelani_media.model.Job;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface JobRepository extends MongoRepository<Job, String> {
    List<Job> findAllByOrderByCreatedAtDesc();
}
