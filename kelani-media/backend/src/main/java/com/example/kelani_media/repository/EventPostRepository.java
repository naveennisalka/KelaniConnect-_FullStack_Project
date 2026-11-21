package com.example.kelani_media.repository;

import com.example.kelani_media.model.EventPost;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EventPostRepository extends MongoRepository<EventPost, String> {

    // All event posts, newest first (used by the events feed)
    List<EventPost> findAllByOrderByCreatedAtDesc();

    // Posts of one event, newest first (used by the event page)
    List<EventPost> findByEventIdOrderByCreatedAtDesc(String eventId);
}
