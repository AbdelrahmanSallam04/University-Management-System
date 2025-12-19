package com.university.backend.dto;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UpdatePriorityDTO {
    private Integer id;
    private Integer priorityId;
}
