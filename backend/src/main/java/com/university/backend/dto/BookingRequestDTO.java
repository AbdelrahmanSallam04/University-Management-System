package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

/**
 * DTO used to receive room booking data from the frontend form.
 */
@Getter
@Setter
public class BookingRequestDTO {

    // The Room ID being booked (FK to Room entity)
    private Integer roomId;

    // Purpose of the booking
    private String purpose;

    // Start time of the reservation (YYYY-MM-DDTHH:MM:SS format)
    private LocalDateTime startTime;

    // End time of the reservation
    private LocalDateTime endTime;
}