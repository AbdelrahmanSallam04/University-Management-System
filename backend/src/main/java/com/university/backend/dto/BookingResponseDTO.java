package com.university.backend.dto;

import com.university.backend.model.Booking; // Make sure to import Booking entity
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

/**
 * DTO used to return saved booking details to the frontend.
 * It contains only initialized, necessary fields (no proxies).
 */
@Getter
@Setter
@Builder // <--- 1. USE BUILDER
@AllArgsConstructor // Required for @Builder to work correctly with all fields
public class BookingResponseDTO {

    private Integer bookingId;
    private Integer roomId;
    private String roomCode; // Add room code for frontend confirmation
    private String purpose;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status; // "Pending" or "Confirmed"

    // Default constructor required by JPA
    public BookingResponseDTO() {
    }

    // --- 2. EASY MAPPING METHOD ---
    public static BookingResponseDTO fromEntity(Booking booking) {
        // This is still manual, but cleaner and safer than constructor calls.
        return BookingResponseDTO.builder()
                .bookingId(booking.getBookingId())
                // Ensure room is accessed before the persistence context closes (safe in @Transactional method)
                .roomId(booking.getRoom().getRoom_id())
                .roomCode(booking.getRoom().getRoom_code())
                .purpose(booking.getPurpose())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .status(booking.getStatus().getStatus())
                .build();
    }
}