package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;

// DTO to structure the output for the React frontend
@Setter
@Getter
public class RoomAvailabilityDTO {
    // Setters (optional, but good practice)
    // Getters for JSON serialization
    private Integer id;
    private String roomCode;
    private Integer capacity;
    private String roomType;
    private String status;
    private String timeSlot;  // Either the booked purpose or the free time range
    private String purpose;

    // Constructor for all fields
    public RoomAvailabilityDTO(Integer id, String roomCode, Integer capacity, String roomType, String status, String timeSlot, String purpose) {
        this.id = id;
        this.roomCode = roomCode;
        this.capacity = capacity;
        this.roomType = roomType;
        this.status = status;
        this.timeSlot = timeSlot;
        this.purpose = purpose;
    }

}