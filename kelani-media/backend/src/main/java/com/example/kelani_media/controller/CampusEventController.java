package com.example.kelani_media.controller;

import com.example.kelani_media.dto.CreateEventRequest;
import com.example.kelani_media.model.CampusEvent;
import com.example.kelani_media.model.User;
import com.example.kelani_media.repository.CampusEventRepository;
import com.example.kelani_media.service.CurrentUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class CampusEventController {

    private final CampusEventRepository eventRepository;
    private final CurrentUserService currentUserService;

    @GetMapping
    public List<CampusEvent> getEvents() {
        return eventRepository.findAllByOrderByStartsAtAsc();
    }

    @PostMapping
    public CampusEvent createEvent(Authentication authentication, @Valid @RequestBody CreateEventRequest request) {
        User organizer = currentUserService.require(authentication);
        currentUserService.requireAnyRole(organizer, "ADMIN", "EVENT_ORGANIZER");

        CampusEvent event = new CampusEvent();
        event.setTitle(request.title().trim());
        event.setOrganizer(request.organizer().trim());
        event.setOrganizerId(organizer.getId());
        event.setOrganizerName((organizer.getFirstName() + " " + organizer.getLastName()).trim());
        event.setLocation(request.location().trim());
        event.setDescription(request.description().trim());
        event.setStartsAt(request.startsAt());
        event.setImageUrl(blankToNull(request.imageUrl()));
        return eventRepository.save(event);
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
