package com.university.backend.service;

import com.university.backend.dto.*;
import com.university.backend.model.BookingStatus;
import com.university.backend.model.Room;
import com.university.backend.model.Booking;
import com.university.backend.model.StaffMember;
import com.university.backend.repository.RoomRepository;
import com.university.backend.repository.BookingRepository;
import com.university.backend.repository.BookingStatusRepository;
import com.university.backend.repository.StaffMemberRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final BookingStatusRepository bookingStatusRepository;
    private final StaffMemberRepository staffMemberRepository;
    // Hardcoded daily slots for simplicity (usually fetched from config/DB)
    private static final List<String> DAILY_SLOTS = List.of(
            "08:00-09:30", "09:30-11:00", "11:00-12:30", "12:30-14:00",
            "14:00-15:30", "15:30-17:00"
    );

    // CRITICAL: Status ID for 'Confirmed' or 'Approved' bookings.
    // You MUST configure this ID based on your database's BookingStatus table.
    private static final Integer CONFIRMED_STATUS_ID = 1;
    private static final Integer PENDING_STATUS_ID = 2; // Status used for new requests


    @Autowired
    public RoomService(RoomRepository roomRepository, BookingRepository bookingRepository, BookingStatusRepository bookingStatusRepository, StaffMemberRepository staffMemberRepository) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.bookingStatusRepository = bookingStatusRepository;
        this.staffMemberRepository = staffMemberRepository;
    }

    public List<RoomAvailabilityDTO> getAvailableRooms(String dateStr, String roomType) {
        System.out.println("Processing availability request for: " + dateStr + ", Type: " + roomType);

        // 1. Prepare Date for Query (Assuming 'dateStr' is 'YYYY-MM-DD')
        LocalDateTime startOfDay = LocalDateTime.parse(dateStr + "T00:00:00");
        LocalDateTime endOfDay = LocalDateTime.parse(dateStr + "T23:59:59");

        // 2. Fetch all active rooms, optionally filtered by type
        List<Room> rooms;

        if ("All Rooms".equalsIgnoreCase(roomType)) {
            // Fetch all active rooms
            rooms = roomRepository.findByIsActiveTrue();
        } else {
            // Fetch active rooms filtered by RoomType Name (using custom JPA query)
            rooms = roomRepository.findActiveRoomsByType(roomType);
        }

        // 3. Fetch all confirmed bookings for the entire day
        List<Booking> bookedSlots = bookingRepository.findByDayAndStatus(
                startOfDay,
                endOfDay,
                CONFIRMED_STATUS_ID // Use the defined confirmed status ID
        );

        List<RoomAvailabilityDTO> results = new ArrayList<>();
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        // 4. Compare all rooms/slots against actual bookings
        for (Room room : rooms) {
            for (String slot : DAILY_SLOTS) {
                LocalTime slotStart = LocalTime.parse(slot.split("-")[0], timeFormatter);
                LocalTime slotEnd = LocalTime.parse(slot.split("-")[1], timeFormatter);

                // Check for overlapping bookings
                boolean isBooked = bookedSlots.stream().anyMatch(booking ->
                        booking.getRoom().getRoom_id()==room.getRoom_id() &&
                                // Check for overlap: [Booking Start < Slot End] AND [Booking End > Slot Start]
                                booking.getStartTime().toLocalTime().isBefore(slotEnd) &&
                                booking.getEndTime().toLocalTime().isAfter(slotStart)
                );

                if (isBooked) {
                    // Find the booking object to get details (e.g., purpose)
                    Booking booking = bookedSlots.stream().filter(b -> b.getRoom().getRoom_id()==room.getRoom_id()).findFirst().get();

                    results.add(new RoomAvailabilityDTO(
                            room.getRoom_id(),
                            room.getRoom_code(),
                            room.getCapacity(),
                            room.getRoom_type().getType(),
                            "Booked",
                            slot,
                            booking.getPurpose()
                    ));
                } else {
                    // Room is FREE for this time slot
                    results.add(new RoomAvailabilityDTO(
                            room.getRoom_id(),
                            room.getRoom_code(),
                            room.getCapacity(),
                            room.getRoom_type().getType(),
                            "Free",
                            slot,// Display the free time slot range
                            null
                    ));
                }
            }
        }

        // In a real application, you might post-process this list (e.g., remove duplicate room rows)
        return results;
    }



    public Booking createBooking(BookingRequestDTO request, Integer facultyMemberID) {

        // 1. Availability Check: Use the repository query to find existing confirmed bookings that conflict
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
                request.getRoomId(),
                request.getStartTime(),
                request.getEndTime()
        );

        if (!conflictingBookings.isEmpty()) {
            throw new IllegalStateException("The requested room is already CONFIRMED booked during this time slot.");
        }

        // 2. Fetch Dependent Entities (Ensuring IDs are valid)
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new EntityNotFoundException("Room not found with ID: " + request.getRoomId()));

        StaffMember faculty = staffMemberRepository.findById(facultyMemberID)
                .orElseThrow(() -> new EntityNotFoundException("Faculty member not found with ID: " + facultyMemberID));

        BookingStatus confirmedStatus = bookingStatusRepository.findById(CONFIRMED_STATUS_ID)
                .orElseThrow(() -> new EntityNotFoundException("Booking Status (PENDING) not found. Check database initialization."));

        // 3. Create the Booking Entity
        Booking newBooking = new Booking();
        // Assuming your Booking entity uses Lombok setters (setRoom, setBookedByFaculty, etc.)
        newBooking.setRoom(room);
        newBooking.setBookedByFaculty(faculty);
        newBooking.setPurpose(request.getPurpose());
        newBooking.setStartTime(request.getStartTime());
        newBooking.setEndTime(request.getEndTime());
        newBooking.setCreatedAt(LocalDateTime.now());
        newBooking.setStatus(confirmedStatus); // Set initial status to PENDING

        // 4. Save the Booking
        return bookingRepository.save(newBooking);
    }


    public List<BookingResponseDTO> findBookingsByFacultyId(Integer facultyId) {
        List<Booking> bookings = bookingRepository.findByBookedByFacultyId(facultyId);

        // Map the JPA entities to the safe DTO structure
        return bookings.stream()
                .map(BookingResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<RoomDTO> getAllRooms() {
        return roomRepository.findAll().stream()
                .filter(Room::isActive) // Only get active rooms
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private RoomDTO convertToDTO(Room room) {
        return RoomDTO.builder()
                .id(room.getRoom_id())
                .roomCode(room.getRoom_code())
                .roomType(room.getRoom_type() != null ? room.getRoom_type().getType() : "Unknown")
                .capacity(room.getCapacity())
                .building(room.getBuilding())
                .floor(room.getFloor())
                .isActive(room.isActive())
                .build();
    }
}