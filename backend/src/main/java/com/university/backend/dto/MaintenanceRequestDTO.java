package com.university.backend.dto;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class MaintenanceRequestDTO {
    private Integer roomId;
    private Integer priorityId;
    private String description;
}
