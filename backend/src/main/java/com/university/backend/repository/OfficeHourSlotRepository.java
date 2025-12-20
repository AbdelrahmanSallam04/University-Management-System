package com.university.backend.repository;

import com.university.backend.model.OfficeHourSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OfficeHourSlotRepository extends JpaRepository<OfficeHourSlot, Long> {

    // Find slots by staff member user ID
    @Query("SELECT os FROM OfficeHourSlot os WHERE os.staffMember.userId = :staffMemberId")
    List<OfficeHourSlot> findByStaffMember_UserId(@Param("staffMemberId") Integer staffMemberId);

    // Find upcoming slots for a staff member within a date range
    @Query("SELECT os FROM OfficeHourSlot os WHERE os.staffMember.userId = :staffMemberId " +
            "AND os.startTime BETWEEN :start AND :end " +
            "ORDER BY os.startTime ASC")
    List<OfficeHourSlot> findByStaffMember_UserIdAndSlotDateTimeBetween(
            @Param("staffMemberId") Integer staffMemberId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    // Find slots by booked student user ID
    @Query("SELECT os FROM OfficeHourSlot os WHERE os.bookedBy.userId = :studentId")
    List<OfficeHourSlot> findByBookedBy_UserId(@Param("studentId") Integer studentId);

    // Find available slots
    List<OfficeHourSlot> findByStatus(OfficeHourSlot.SlotStatus status);

    // Find slots by day of week and staff member
    @Query("SELECT os FROM OfficeHourSlot os WHERE os.dayOfWeek = :dayOfWeek " +
            "AND os.staffMember.userId = :staffMemberId " +
            "AND os.startTime >= :now " +
            "ORDER BY os.startTime ASC")
    List<OfficeHourSlot> findByDayOfWeekAndStaffMemberId(
            @Param("dayOfWeek") String dayOfWeek,
            @Param("staffMemberId") Integer staffMemberId,
            @Param("now") LocalDateTime now);
}