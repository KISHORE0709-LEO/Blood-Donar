package com.blooddonor.dto;

import com.blooddonor.entity.EmergencyRequest;
import com.blooddonor.entity.User;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class EmergencyRequestDto {
    @NotBlank private String patientName;
    @NotNull  private User.BloodType bloodType;
    private EmergencyRequest.UrgencyLevel urgencyLevel;
    @NotBlank private String hospital;
    private String city;
    private String contactPhone;
    private String description;
}


