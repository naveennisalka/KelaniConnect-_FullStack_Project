package com.example.kelani_media.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * An event page on KelaniConnect.
 * Any student can create an event and becomes its first organizer.
 */
@Data
@NoArgsConstructor
@Document(collection = "events")
public class CampusEvent {

    @Id
    private String id;

    // Basic details (asked in the first steps of the "Create Event" wizard)
    private String title;
    private String description;
    private String location;
    private LocalDateTime startsAt;

    // Photos: either a normal image link (https://...) or an uploaded image saved as "data:image/..."
    private String profilePhoto;
    private String coverPhoto;

    // The student who created the event
    private String organizerId;
    private String organizerName;

    // Everyone who can manage this event page (the creator is always in this list)
    private List<Member> organizers = new ArrayList<>();

    // Users who follow this event (shown in their "Watchlist" tab)
    private List<String> followerIds = new ArrayList<>();

    // Users that an organizer invited to follow the event
    private List<String> invitedIds = new ArrayList<>();

    // Tickets and other items the event is selling
    private List<SellItem> items = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * A small copy of a user (id + name) so we can show organizer names
     * without loading every user from the database again.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Member {
        private String userId;
        private String name;
    }

    /** A ticket or any other thing sold by the event. */
    @Data
    @NoArgsConstructor
    public static class SellItem {
        private String id = UUID.randomUUID().toString();
        private String name;
        private String description;
        private double price;
        private String imageUrl;
    }
}
