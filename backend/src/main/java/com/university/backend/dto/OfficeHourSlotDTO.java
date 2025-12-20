package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class OfficeHourSlotDTO {
    private Long id;
    private LocalDateTime slotDateTime;
    private LocalDateTime endDateTime;
    private String studentName;
    private String purpose;
    private String status;
    private boolean bookable;
    private String staffName;
    private String staffType;
    private List<IndividualSlotDTO> slots;
}
