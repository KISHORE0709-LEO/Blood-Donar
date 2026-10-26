package com.blooddonor.controller;

import com.blooddonor.entity.*;
import com.blooddonor.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final DonationService donationService;
    private final EmergencyRequestService requestService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/donations")
    public ResponseEntity<List<Donation>> getAllDonations() {
        return ResponseEntity.ok(donationService.getAll());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userService.getAllUsers().size());
        stats.put("totalDonations", donationService.getAll().size());
        stats.put("openRequests", requestService.getOpen().size());
        stats.put("totalRequests", requestService.getAll().size());
        return ResponseEntity.ok(stats);
    }
}
