package com.university.backend.dto;

import java.time.LocalTime;

public record OfficeHourRequestDTO(
        Integer staffMemberId,
        String dayOfWeek, // e.g., "MONDAY"
        LocalTime startTime,
        LocalTime endTime,
        Integer numberOfWeeks, // How many weeks to repeat this
        Integer slotDurationMinutes
) {}