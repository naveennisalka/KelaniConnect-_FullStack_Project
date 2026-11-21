package com.example.kelani_media.controller;

import com.example.kelani_media.dto.CreateEventRequest;
import com.example.kelani_media.dto.CreateSellItemRequest;
import com.example.kelani_media.dto.EventMemberRequest;
import com.example.kelani_media.dto.UpdateEventPhotosRequest;
import com.example.kelani_media.exception.ApiException;
import com.example.kelani_media.model.CampusEvent;
import com.example.kelani_media.model.TicketPass;
import com.example.kelani_media.model.User;
import com.example.kelani_media.repository.CampusEventRepository;
import com.example.kelani_media.repository.TicketPassRepository;
import com.example.kelani_media.repository.UserRepository;
import com.example.kelani_media.service.CurrentUserService;
import com.example.kelani_media.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.example.kelani_media.service.EventService.blankToNull;
import static com.example.kelani_media.service.EventService.fullName;

/**
 * REST API for event pages.
 *
 * GET  /api/events                          -> all events
 * GET  /api/events/{id}                     -> one event
 * POST /api/events                          -> create an event (any logged in user)
 * PUT  /api/events/{id}/photos              -> change profile / cover photo (organizers)
 * POST /api/events/{id}/follow              -> follow or unfollow an event
 * POST /api/events/{id}/organizers          -> add an organizer (organizers)
 * POST /api/events/{id}/invites             -> invite a member (organizers)
 * POST /api/events/{id}/items               -> add a ticket / item to sell (organizers)
 * POST /api/events/{id}/items/{itemId}/buy  -> buy an item, creates a pass
 */
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class CampusEventController {

    private final CampusEventRepository eventRepository;
    private final UserRepository userRepository;
    private final TicketPassRepository passRepository;
    private final CurrentUserService currentUserService;
    private final EventService eventService;

    @GetMapping
    public List<CampusEvent> getEvents() {
        return eventRepository.findAllByOrderByStartsAtAsc();
    }

    @GetMapping("/{eventId}")
    public CampusEvent getEvent(@PathVariable String eventId) {
        return eventService.findEvent(eventId);
    }

    @PostMapping
    public CampusEvent createEvent(Authentication authentication, @Valid @RequestBody CreateEventRequest request) {
        User creator = currentUserService.require(authentication);

        CampusEvent event = new CampusEvent();
        event.setTitle(request.title().trim());
        event.setDescription(request.description().trim());
        event.setLocation(request.location().trim());
        event.setStartsAt(request.startsAt());
        event.setProfilePhoto(blankToNull(request.profilePhoto()));
        event.setCoverPhoto(blankToNull(request.coverPhoto()));

        // The creator is the first organizer and also follows the event
        event.setOrganizerId(creator.getId());
        event.setOrganizerName(fullName(creator));
        event.getOrganizers().add(new CampusEvent.Member(creator.getId(), fullName(creator)));
        event.getFollowerIds().add(creator.getId());

        // Add the other organizers that were picked in the last step of the wizard
        if (request.organizerIds() != null) {
            for (User member : userRepository.findAllById(request.organizerIds())) {
                if (!eventService.isOrganizer(event, member.getId())) {
                    event.getOrganizers().add(new CampusEvent.Member(member.getId(), fullName(member)));
                    event.getFollowerIds().add(member.getId());
                }
            }
        }

        return eventRepository.save(event);
    }

    @PutMapping("/{eventId}/photos")
    public CampusEvent updatePhotos(
            Authentication authentication,
            @PathVariable String eventId,
            @Valid @RequestBody UpdateEventPhotosRequest request
    ) {
        User user = currentUserService.require(authentication);
        CampusEvent event = eventService.findEvent(eventId);
        eventService.requireOrganizer(event, user);

        // Only change the photos that were sent
        if (request.profilePhoto() != null) {
            event.setProfilePhoto(blankToNull(request.profilePhoto()));
        }
        if (request.coverPhoto() != null) {
            event.setCoverPhoto(blankToNull(request.coverPhoto()));
        }
        return eventRepository.save(event);
    }

    @PostMapping("/{eventId}/follow")
    public CampusEvent toggleFollow(Authentication authentication, @PathVariable String eventId) {
        User user = currentUserService.require(authentication);
        CampusEvent event = eventService.findEvent(eventId);

        if (event.getFollowerIds().contains(user.getId())) {
            event.getFollowerIds().remove(user.getId());
        } else {
            event.getFollowerIds().add(user.getId());
            // Following the event also accepts an invitation
            event.getInvitedIds().remove(user.getId());
        }
        return eventRepository.save(event);
    }

    @PostMapping("/{eventId}/organizers")
    public CampusEvent addOrganizer(
            Authentication authentication,
            @PathVariable String eventId,
            @Valid @RequestBody EventMemberRequest request
    ) {
        User user = currentUserService.require(authentication);
        CampusEvent event = eventService.findEvent(eventId);
        eventService.requireOrganizer(event, user);

        User newOrganizer = findUser(request.userId());
        if (eventService.isOrganizer(event, newOrganizer.getId())) {
            throw new ApiException("This user is already an organizer", HttpStatus.BAD_REQUEST);
        }

        event.getOrganizers().add(new CampusEvent.Member(newOrganizer.getId(), fullName(newOrganizer)));
        if (!event.getFollowerIds().contains(newOrganizer.getId())) {
            event.getFollowerIds().add(newOrganizer.getId());
        }
        return eventRepository.save(event);
    }

    @PostMapping("/{eventId}/invites")
    public CampusEvent inviteMember(
            Authentication authentication,
            @PathVariable String eventId,
            @Valid @RequestBody EventMemberRequest request
    ) {
        User user = currentUserService.require(authentication);
        CampusEvent event = eventService.findEvent(eventId);
        eventService.requireOrganizer(event, user);

        User invitedUser = findUser(request.userId());
        if (event.getFollowerIds().contains(invitedUser.getId())) {
            throw new ApiException("This user already follows the event", HttpStatus.BAD_REQUEST);
        }
        if (!event.getInvitedIds().contains(invitedUser.getId())) {
            event.getInvitedIds().add(invitedUser.getId());
        }
        return eventRepository.save(event);
    }

    @PostMapping("/{eventId}/items")
    public CampusEvent addSellItem(
            Authentication authentication,
            @PathVariable String eventId,
            @Valid @RequestBody CreateSellItemRequest request
    ) {
        User user = currentUserService.require(authentication);
        CampusEvent event = eventService.findEvent(eventId);
        eventService.requireOrganizer(event, user);

        CampusEvent.SellItem item = new CampusEvent.SellItem();
        item.setName(request.name().trim());
        item.setDescription(blankToNull(request.description()));
        item.setPrice(request.price());
        item.setImageUrl(blankToNull(request.imageUrl()));

        event.getItems().add(item);
        return eventRepository.save(event);
    }

    @PostMapping("/{eventId}/items/{itemId}/buy")
    public TicketPass buyItem(Authentication authentication, @PathVariable String eventId, @PathVariable String itemId) {
        User buyer = currentUserService.require(authentication);
        CampusEvent event = eventService.findEvent(eventId);

        CampusEvent.SellItem item = event.getItems().stream()
                .filter(sellItem -> sellItem.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ApiException("Item not found", HttpStatus.NOT_FOUND));

        // NOTE: there is no real payment gateway yet, buying just saves a pass for the user
        TicketPass pass = new TicketPass();
        pass.setEventId(event.getId());
        pass.setEventTitle(event.getTitle());
        pass.setEventStartsAt(event.getStartsAt());
        pass.setItemId(item.getId());
        pass.setItemName(item.getName());
        pass.setPrice(item.getPrice());
        pass.setBuyerId(buyer.getId());
        pass.setBuyerName(fullName(buyer));
        return passRepository.save(pass);
    }

    private User findUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }
}
