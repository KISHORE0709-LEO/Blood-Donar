package com.blooddonor.service;

import com.blooddonor.dto.DonationDto;
import com.blooddonor.entity.*;
import com.blooddonor.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;
    private final EmergencyRequestRepository requestRepository;

    @Transactional
    public Donation donate(DonationDto dto, User donor) {
        Donation donation = Donation.builder()
                .donor(donor)
                .hospital(dto.getHospital())
                .notes(dto.getNotes())
                .build();

        if (dto.getRequestId() != null) {
            EmergencyRequest req = requestRepository.findById(dto.getRequestId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Linked request not found"));
            if (req.getStatus() != EmergencyRequest.Status.OPEN) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "This request is no longer open");
            }
            donation.setRequest(req);
            req.setStatus(EmergencyRequest.Status.FULFILLED);
        }
        return donationRepository.save(donation);
    }

    public List<Donation> getMyDonations(User donor) {
        return donationRepository.findByDonorOrderByDonatedAtDesc(donor);
    }

    public List<Donation> getAll() {
        return donationRepository.findAllByOrderByDonatedAtDesc();
    }

    public long countByDonor(User donor) {
        return donationRepository.countByDonor(donor);
    }
}
