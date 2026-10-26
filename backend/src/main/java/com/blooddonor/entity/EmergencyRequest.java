package com.blooddonor.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String patientName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private User.BloodType bloodType;

    @Enumerated(EnumType.STRING)
    private UrgencyLevel urgencyLevel;

    @Column(nullable = false)
    private String hospital;

    private String city;
    private String contactPhone;
    private String description;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by")
    @JsonIgnore
    private User requestedBy;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = Status.OPEN;
        if (urgencyLevel == null) urgencyLevel = UrgencyLevel.MEDIUM;
    }

    public enum UrgencyLevel { LOW, MEDIUM, HIGH, CRITICAL }
    public enum Status { OPEN, FULFILLED, CLOSED }
}
