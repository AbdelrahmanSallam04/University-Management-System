package com.university.backend.dto;

import java.time.LocalDateTime;

// OfficeHourResponseDTO.java
public record OfficeHourResponseDTO(
        Integer id,
        LocalDateTime startTime,
        LocalDateTime endTime,
        String status
) {}