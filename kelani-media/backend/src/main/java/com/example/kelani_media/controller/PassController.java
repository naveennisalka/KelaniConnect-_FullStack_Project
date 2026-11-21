package com.example.kelani_media.controller;

import com.example.kelani_media.model.TicketPass;
import com.example.kelani_media.model.User;
import com.example.kelani_media.repository.TicketPassRepository;
import com.example.kelani_media.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * GET /api/passes/me -> tickets / items the logged in user has bought ("Passes" tab).
 */
@RestController
@RequestMapping("/api/passes")
@RequiredArgsConstructor
public class PassController {

    private final TicketPassRepository passRepository;
    private final CurrentUserService currentUserService;

    @GetMapping("/me")
    public List<TicketPass> getMyPasses(Authentication authentication) {
        User user = currentUserService.require(authentication);
        return passRepository.findByBuyerIdOrderByPurchasedAtDesc(user.getId());
    }
}
