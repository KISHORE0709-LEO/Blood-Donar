package com.blooddonor.dto;

import com.blooddonor.entity.User;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank private String fullName;
    @Email @NotBlank private String email;
    @NotBlank @Size(min = 6) private String password;
    private String phone;
    private String city;
    private User.BloodType bloodType;
    private User.Role role = User.Role.DONOR;
}
