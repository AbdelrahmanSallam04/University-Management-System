package com.university.backend.controller;

import com.university.backend.dto.RoomAvailabilityDTO;
import com.university.backend.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
// CRITICAL: Allows the React frontend (localhost:3000) to communicate with this backend (localhost:8080)
@CrossOrigin(origins = "http://localhost:3000")
public class RoomController {

    private final RoomService roomService;

    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // Endpoint: GET http://localhost:8080/api/rooms/availability?date=...&roomType=...
    @GetMapping("/availability")
    public List<RoomAvailabilityDTO> getRoomAvailability(
            @RequestParam(value = "date", required = true) String date,
            @RequestParam(value = "roomType", defaultValue = "All Rooms") String roomType) {

        // Log request details
        System.out.println("API HIT: Fetching room availability for Date=" + date + ", Type=" + roomType);

        // Call the service layer to get filtered data
        return roomService.getAvailableRooms(date, roomType);
    }
}