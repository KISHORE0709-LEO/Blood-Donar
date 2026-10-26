package com.blooddonor.service;

import com.blooddonor.dto.EmergencyRequestDto;
import com.blooddonor.entity.*;
import com.blooddonor.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmergencyRequestService {

    private final EmergencyRequestRepository requestRepository;

    public EmergencyRequest create(EmergencyRequestDto dto, User requester) {
        EmergencyRequest req = EmergencyRequest.builder()
                .patientName(dto.getPatientName())
                .bloodType(dto.getBloodType())
                .urgencyLevel(dto.getUrgencyLevel())
                .hospital(dto.getHospital())
                .city(dto.getCity())
                .contactPhone(dto.getContactPhone())
                .description(dto.getDescription())
                .requestedBy(requester)
                .build();
        return requestRepository.save(req);
    }

    public List<EmergencyRequest> getAll() {
        return requestRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<EmergencyRequest> getOpen() {
        return requestRepository.findByStatusOrderByCreatedAtDesc(EmergencyRequest.Status.OPEN);
    }

    @Transactional
    public EmergencyRequest updateStatus(Long id, EmergencyRequest.Status status, User actor) {
        EmergencyRequest req = requestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));
        boolean isOwner = req.getRequestedBy() != null && req.getRequestedBy().getId().equals(actor.getId());
        boolean isAdmin = actor.getRole() == User.Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("You can only update your own requests");
        }
        req.setStatus(status);
        return requestRepository.save(req);
    }

    public List<EmergencyRequest> getByUser(User user) {
        return requestRepository.findByRequestedByOrderByCreatedAtDesc(user);
    }

    public EmergencyRequest getById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
    }
}
