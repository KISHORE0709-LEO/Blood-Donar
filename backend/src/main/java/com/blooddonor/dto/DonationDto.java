package com.blooddonor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DonationDto {
    private Long requestId;
    @NotBlank @Size(max = 255) private String hospital;
    @Size(max = 2000)
    private String notes;
}
