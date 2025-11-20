package com.university.backend.dto;

// DTO to structure the output for the React frontend
public class RoomAvailabilityDTO {
    private Integer id;
    private String roomCode;
    private Integer capacity;
    private String roomType;
    private String status;
    private String timeSlot;  // Either the booked purpose or the free time range

    // Constructor for all fields
    public RoomAvailabilityDTO(Integer id, String roomCode, Integer capacity, String roomType, String status, String timeSlot) {
        this.id = id;
        this.roomCode = roomCode;
        this.capacity = capacity;
        this.roomType = roomType;
        this.status = status;
        this.timeSlot = timeSlot;
    }

    // Getters for JSON serialization
    public Integer getId() { return id; }
    public String getRoomCode() { return roomCode; }
    public Integer getCapacity() { return capacity; }
    public String getRoomType() { return roomType; }
    public String getStatus() { return status; }
    public String getTimeSlot() { return timeSlot; }

    // Setters (optional, but good practice)
    public void setId(Integer id) { this.id = id; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setRoomType(String roomType) { this.roomType = roomType; }
    public void setStatus(String status) { this.status = status; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }
}