package com.blooddonor.controller;

import com.blooddonor.dto.EmergencyRequestDto;
import com.blooddonor.entity.*;
import com.blooddonor.service.EmergencyRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class EmergencyRequestController {

    private final EmergencyRequestService service;

    @GetMapping
    public ResponseEntity<List<EmergencyRequest>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/open")
    public ResponseEntity<List<EmergencyRequest>> getOpen() {
        return ResponseEntity.ok(service.getOpen());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmergencyRequest> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<EmergencyRequest> create(
            @Valid @RequestBody EmergencyRequestDto dto,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.create(dto, user));
    }

    @GetMapping("/my")
    public ResponseEntity<List<EmergencyRequest>> getMyRequests(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.getByUser(user));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EmergencyRequest> updateStatus(
            @PathVariable Long id,
            @RequestParam EmergencyRequest.Status status,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.updateStatus(id, status, user));
    }
}
