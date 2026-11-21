package com.example.kelani_media.repository;

import com.example.kelani_media.model.TicketPass;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TicketPassRepository extends MongoRepository<TicketPass, String> {

    // Passes bought by one user, newest first
    List<TicketPass> findByBuyerIdOrderByPurchasedAtDesc(String buyerId);
}
