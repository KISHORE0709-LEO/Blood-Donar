package com.blooddonor.repository;

import com.blooddonor.entity.Donation;
import com.blooddonor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByDonor(User donor);
    List<Donation> findByDonorOrderByDonatedAtDesc(User donor);
    List<Donation> findAllByOrderByDonatedAtDesc();
    long countByDonor(User donor);
}
