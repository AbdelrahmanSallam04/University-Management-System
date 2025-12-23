package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class IndividualSlotDTO {
    private Long id;
    private LocalDateTime slotDateTime;
    private LocalDateTime endDateTime;
    private Integer duration;
    private String studentName;
    private String purpose;
    private String status;
    private Boolean bookable;
    private String staffName;
    private String staffType;
}