package com.blooddonor.controller;

import com.blooddonor.entity.User;
import com.blooddonor.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/donors")
@RequiredArgsConstructor
public class DonorController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAvailable() {
        return ResponseEntity.ok(userService.getAvailableDonors());
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchByBloodType(@RequestParam User.BloodType bloodType) {
        return ResponseEntity.ok(userService.getDonorsByBloodType(bloodType));
    }

    @PatchMapping("/availability")
    public ResponseEntity<User> toggleAvailability(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.toggleAvailability(user.getId()));
    }
}
