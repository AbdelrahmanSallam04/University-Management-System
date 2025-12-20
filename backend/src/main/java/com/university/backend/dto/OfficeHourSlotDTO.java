package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class OfficeHourSlotDTO {
    private Long id;
    private LocalDateTime slotDateTime;
    private LocalDateTime endDateTime;
    private String studentName;
    private String purpose;
    private String status;
    private boolean isBookable;
    private String staffName;
    private String staffType;
}
