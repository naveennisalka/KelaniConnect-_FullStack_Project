package com.example.kelani_media.service;

import com.example.kelani_media.exception.ApiException;
import com.example.kelani_media.model.CampusEvent;
import com.example.kelani_media.model.User;
import com.example.kelani_media.repository.CampusEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/**
 * Small helper methods that both event controllers need.
 */
@Service
@RequiredArgsConstructor
public class EventService {

    private final CampusEventRepository eventRepository;

    public CampusEvent findEvent(String eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new ApiException("Event not found", HttpStatus.NOT_FOUND));
    }

    /** True if the user created the event or was added as an organizer. */
    public boolean isOrganizer(CampusEvent event, String userId) {
        if (userId.equals(event.getOrganizerId())) {
            return true;
        }
        for (CampusEvent.Member organizer : event.getOrganizers()) {
            if (userId.equals(organizer.getUserId())) {
                return true;
            }
        }
        return false;
    }

    /** Stops the request with "403 Forbidden" if the user is not an organizer of the event. */
    public void requireOrganizer(CampusEvent event, User user) {
        if (!isOrganizer(event, user.getId())) {
            throw new ApiException("Only the event organizers can do this", HttpStatus.FORBIDDEN);
        }
    }

    public static String fullName(User user) {
        return (user.getFirstName() + " " + user.getLastName()).trim();
    }

    /** Empty text becomes null, so we don't save "" in the database. */
    public static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
