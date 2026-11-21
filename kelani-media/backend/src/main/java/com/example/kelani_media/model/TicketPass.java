package com.example.kelani_media.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * A "pass" is created when a user buys a ticket (or another item) from an event.
 * These are shown in the "Passes" tab on the events feed.
 */
@Data
@NoArgsConstructor
@Document(collection = "passes")
public class TicketPass {

    @Id
    private String id;

    private String eventId;
    private String eventTitle;
    private LocalDateTime eventStartsAt;

    private String itemId;
    private String itemName;
    private double price;

    private String buyerId;
    private String buyerName;

    private LocalDateTime purchasedAt = LocalDateTime.now();
}
