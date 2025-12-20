package com.university.backend.repository;

import com.university.backend.model.OfficeHourSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OfficeHourSlotRepository extends JpaRepository<OfficeHourSlot, Long> {

    // Use StaffMember_UserId with underscore
    @Query("SELECT os FROM OfficeHourSlot os WHERE os.officeHours.staffMember.userId = :staffMemberId")
    List<OfficeHourSlot> findByOfficeHours_StaffMember_UserId(Integer staffMemberId);

    @Query("SELECT os FROM OfficeHourSlot os WHERE os.officeHours.staffMember.userId = :staffMemberId AND os.slotDateTime BETWEEN :start AND :end")
    List<OfficeHourSlot> findByOfficeHours_StaffMember_UserIdAndSlotDateTimeBetween(
            Integer staffMemberId, LocalDateTime start, LocalDateTime end);

    // For bookedBy, use userId
    @Query("SELECT os FROM OfficeHourSlot os WHERE os.bookedBy.userId = :studentId")
    List<OfficeHourSlot> findByBookedBy_UserId(Integer studentId);

    List<OfficeHourSlot> findByOfficeHoursId(Long officeHoursId);


}