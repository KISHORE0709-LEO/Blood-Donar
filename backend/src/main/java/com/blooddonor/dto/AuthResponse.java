package com.blooddonor.dto;

import com.blooddonor.entity.User;
import lombok.*;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long id;
    private String fullName;
    private String email;
    private User.Role role;
    private User.BloodType bloodType;
    private boolean available;
}
