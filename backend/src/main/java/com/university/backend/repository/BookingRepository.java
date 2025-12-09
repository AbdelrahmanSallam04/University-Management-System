package com.university.backend.repository;

import com.university.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    /**
     * Finds all confirmed bookings that overlap with a given time range.
     * This is crucial for checking room availability.
     * @param startOfDay Start time of the search day (e.g., 2025-11-20 00:00:00)
     * @param endOfDay End time of the search day (e.g., 2025-11-20 23:59:59)
     * @param statusId The ID corresponding to the 'Confirmed' status (e.g., 1 or 2)
     * @return List of Booking entities
     */
    @Query("SELECT b FROM Booking b WHERE b.status.id = :statusId AND b.startTime < :endOfDay AND b.endTime > :startOfDay")
    List<Booking> findByDayAndStatus(LocalDateTime startOfDay, LocalDateTime endOfDay, Integer statusId);



    @Query("SELECT b FROM Booking b WHERE b.room.room_id = :roomId AND b.status.id = 1 AND b.startTime < :newEndTime AND b.endTime > :newStartTime")
    List<Booking> findConflictingBookings(
            @Param("roomId") Integer roomId,
            @Param("newStartTime") LocalDateTime newStartTime,
            @Param("newEndTime") LocalDateTime newEndTime
    );


    @Query("SELECT b FROM Booking b WHERE b.bookedByFaculty.userId = :facultyId ORDER BY b.startTime DESC")
    List<Booking> findByBookedByFacultyId(@Param("facultyId") Integer facultyId);
}