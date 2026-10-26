package com.blooddonor.service;

import com.blooddonor.entity.User;
import com.blooddonor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAvailableDonors() {
        return userRepository.findByAvailableTrue();
    }

    public List<User> getDonorsByBloodType(User.BloodType bloodType) {
        return userRepository.findByBloodTypeAndAvailableTrue(bloodType);
    }

    public User toggleAvailability(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setAvailable(!user.isAvailable());
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
