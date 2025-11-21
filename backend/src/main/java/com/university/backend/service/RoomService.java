package com.university.backend.service;

import com.university.backend.dto.RoomAvailabilityDTO;
import com.university.backend.model.Room;
import com.university.backend.model.Booking;
import com.university.backend.repository.RoomRepository;
import com.university.backend.repository.BookingRepository;
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

    // Hardcoded daily slots for simplicity (usually fetched from config/DB)
    private static final List<String> DAILY_SLOTS = List.of(
            "08:00-09:30", "09:30-11:00", "11:00-12:30", "12:30-14:00",
            "14:00-15:30", "15:30-17:00"
    );

    // CRITICAL: Status ID for 'Confirmed' or 'Approved' bookings.
    // You MUST configure this ID based on your database's BookingStatus table.
    private static final Integer CONFIRMED_STATUS_ID = 1;

    @Autowired
    public RoomService(RoomRepository roomRepository, BookingRepository bookingRepository) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
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
                            slot // Display the free time slot range
                    ));
                }
            }
        }

        // In a real application, you might post-process this list (e.g., remove duplicate room rows)
        return results;
    }
}