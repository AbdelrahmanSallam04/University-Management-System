package com.university.backend.dto;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Data
@Setter
@Getter
public class MaintenanceResponseDTO {

    private Integer id;
    private String roomName;
    private String reporterName;
    private String adminName; // Will be null if not assigned
    private String statusName;
    private Integer statusId;    // ADD THIS
    private String priorityLevel;
    private Integer priorityId;  // ADD THIS
    private String description;
    private LocalDateTime createdAt;
}
