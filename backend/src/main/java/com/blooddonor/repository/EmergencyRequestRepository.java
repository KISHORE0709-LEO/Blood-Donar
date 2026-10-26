package com.blooddonor.repository;

import com.blooddonor.entity.EmergencyRequest;
import com.blooddonor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmergencyRequestRepository extends JpaRepository<EmergencyRequest, Long> {
    List<EmergencyRequest> findByStatus(EmergencyRequest.Status status);
    List<EmergencyRequest> findByBloodType(User.BloodType bloodType);
    List<EmergencyRequest> findByRequestedBy(User user);
    List<EmergencyRequest> findByRequestedByOrderByCreatedAtDesc(User user);
    List<EmergencyRequest> findByStatusOrderByCreatedAtDesc(EmergencyRequest.Status status);
    List<EmergencyRequest> findAllByOrderByCreatedAtDesc();
}
