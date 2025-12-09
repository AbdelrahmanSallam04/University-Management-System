package com.university.backend.controller;

import com.university.backend.dto.BookingRequestDTO;
import com.university.backend.dto.RoomAvailabilityDTO;
import com.university.backend.model.Booking;
import com.university.backend.service.RoomService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import jakarta.servlet.http.HttpSession;
import com.university.backend.dto.BookingResponseDTO;


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

    @PostMapping("/book")
    public ResponseEntity<?> createNewBooking(@RequestBody BookingRequestDTO request, HttpSession session) {
        try {

            Integer facultyMemberID = (Integer) session.getAttribute("userID");
            System.out.println("==================Faculty Member ID is:" + facultyMemberID);
            Booking savedBooking = roomService.createBooking(request, facultyMemberID);
            BookingResponseDTO responseDTO = BookingResponseDTO.fromEntity(savedBooking);
            // Return 201 Created status
            return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);

        } catch (IllegalStateException e) {
            // Catches the booking conflict check failure from the service layer
            // Returns 409 CONFLICT, which the frontend modal catches to display the error message.
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        } catch (EntityNotFoundException e) {
            // Catches missing Room, Faculty, or Booking Status (if IDs are invalid)
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            // General server error
            return new ResponseEntity<>("Internal server error during booking: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/bookings/my")
    public ResponseEntity<?> getMyBookings(HttpSession session) {
        Integer facultyId = (Integer) session.getAttribute("userID");

        if (facultyId == null) {
            return new ResponseEntity<>("Authentication required.", HttpStatus.UNAUTHORIZED);
        }

        try {
            // Fetch bookings history from the service layer
            List<BookingResponseDTO> bookings = roomService.findBookingsByFacultyId(facultyId);
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error fetching user bookings: " + e.getMessage());
            return new ResponseEntity<>("Failed to fetch user bookings.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}