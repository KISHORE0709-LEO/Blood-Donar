package com.blooddonor.controller;

import com.blooddonor.dto.DonationDto;
import com.blooddonor.entity.*;
import com.blooddonor.service.DonationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    @PostMapping
    public ResponseEntity<Donation> donate(
            @Valid @RequestBody DonationDto dto,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(donationService.donate(dto, user));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Donation>> myDonations(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(donationService.getMyDonations(user));
    }

    @GetMapping("/my/count")
    public ResponseEntity<Long> myCount(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(donationService.countByDonor(user));
    }
}
