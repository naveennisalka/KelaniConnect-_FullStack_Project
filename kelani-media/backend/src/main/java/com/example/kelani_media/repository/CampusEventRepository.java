package com.example.kelani_media.repository;

import com.example.kelani_media.model.CampusEvent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CampusEventRepository extends MongoRepository<CampusEvent, String> {
    List<CampusEvent> findAllByOrderByStartsAtAsc();
}
