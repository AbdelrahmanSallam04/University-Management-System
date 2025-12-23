package com.university.backend.service;

import com.university.backend.dto.OfficeHourRequestDTO;
import com.university.backend.model.OfficeHourSlot;
import com.university.backend.model.StaffMember;
import com.university.backend.repository.OfficeHourSlotRepository;
import com.university.backend.repository.StaffMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OfficeHourService {

    private final OfficeHourSlotRepository officeHourRepository;
    private final StaffMemberRepository staffMemberRepository;

    /**
     * Generates recurring 30-minute office hour slots for a specific day of the week
     * across a defined number of weeks.
     */
    @Transactional
    public List<OfficeHourSlot> createRecurringOfficeHours(OfficeHourRequestDTO request) {
        // 1. Validate Staff Member
        StaffMember staff = staffMemberRepository.findById(request.staffMemberId())
                .orElseThrow(() -> new RuntimeException("Staff member not found with ID: " + request.staffMemberId()));

        // 2. Parse Day and Times
        DayOfWeek targetDay = DayOfWeek.valueOf(request.dayOfWeek().toUpperCase());
        LocalTime startTime = request.startTime();
        LocalTime endTime = request.endTime();

        if (!startTime.isBefore(endTime)) {
            throw new IllegalArgumentException("Start time must be before end time.");
        }

        List<OfficeHourSlot> allGeneratedSlots = new ArrayList<>();

        // 3. Find the first occurrence of the selected day (today or in the future)
        LocalDate firstOccurrence = LocalDate.now().with(TemporalAdjusters.nextOrSame(targetDay));

        // 4. Loop through the number of weeks requested
        for (int i = 0; i < request.numberOfWeeks(); i++) {
            LocalDate currentWeekDate = firstOccurrence.plusWeeks(i);
            LocalDateTime blockStart = LocalDateTime.of(currentWeekDate, startTime);
            LocalDateTime blockEnd = LocalDateTime.of(currentWeekDate, endTime);

            // 5. Conflict Check: Skip this week if it overlaps with existing slots
            boolean hasOverlap = officeHourRepository.existsOverlappingSlot(
                    staff.getUserId(),
                    blockStart,
                    blockEnd
            );

            if (hasOverlap) {
                // We skip this specific day/week to avoid partial overlaps,
                // but continue the loop for subsequent weeks.
                continue;
            }

            // 6. Generate 30-minute intervals within this block
            LocalDateTime pointer = blockStart;
            int duration = (request.slotDurationMinutes() != null) ? request.slotDurationMinutes() : 30;

            while (pointer.plusMinutes(duration).isBefore(blockEnd) ||
                    pointer.plusMinutes(duration).isEqual(blockEnd)) {

                OfficeHourSlot slot = new OfficeHourSlot();
                slot.setStaffMember(staff);
                slot.setStartTime(pointer);
                slot.setEndTime(pointer.plusMinutes(duration));
                slot.setDayOfWeek(targetDay);
                slot.setSlotDuration(duration);
                slot.setStatus(OfficeHourSlot.SlotStatus.AVAILABLE);

                allGeneratedSlots.add(slot);

                // Move pointer to the next 30-minute mark
                pointer = pointer.plusMinutes(duration);
            }
        }

        // 7. Batch save all generated slots for efficiency
        return officeHourRepository.saveAll(allGeneratedSlots);
    }

    /**
     * Retrieves all office hour slots for a specific staff member, ordered by time.
     */
    public List<OfficeHourSlot> getSlotsByStaffMember(Integer staffId) {
        if (!staffMemberRepository.existsById(staffId)) {
            throw new RuntimeException("Staff member not found with ID: " + staffId);
        }
        return officeHourRepository.findByStaffMember_UserId(staffId);
    }

    /**
     * Optional: Logic to cancel a slot (used by professor)
     */
    @Transactional
    public void cancelSlot(Integer slotId) {
        OfficeHourSlot slot = officeHourRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (slot.getStatus() == OfficeHourSlot.SlotStatus.BOOKED) {
            // Logic for notifying student could go here
        }

        slot.setStatus(OfficeHourSlot.SlotStatus.CANCELLED);
        officeHourRepository.save(slot);
    }
}