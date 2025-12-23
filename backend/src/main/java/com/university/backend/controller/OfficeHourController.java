package com.university.backend.controller;

import com.university.backend.dto.OfficeHourRequestDTO;
import com.university.backend.model.OfficeHourSlot;
import com.university.backend.service.OfficeHourService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/office-hours")
@RequiredArgsConstructor
public class OfficeHourController {

    private final OfficeHourService officeHourService;

    /**
     * Endpoint to setup recurring office hours.
     * Takes a day of the week, start/end times, and number of weeks to repeat.
     */
    @PostMapping("/setup-recurring")
    public ResponseEntity<List<OfficeHourSlot>> setupRecurringHours(@RequestBody OfficeHourRequestDTO request) {
        List<OfficeHourSlot> createdSlots = officeHourService.createRecurringOfficeHours(request);
        return new ResponseEntity<>(createdSlots, HttpStatus.CREATED);
    }

    /**
     * Retrieves all office hour slots for a specific staff member (Professor/TA).
     */
    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<OfficeHourSlot>> getStaffSlots(@PathVariable Integer staffId) {
        List<OfficeHourSlot> slots = officeHourService.getSlotsByStaffMember(staffId);
        return ResponseEntity.ok(slots);
    }

    /**
     * Allows a staff member to cancel a specific slot.
     */
    @PatchMapping("/slots/{slotId}/cancel")
    public ResponseEntity<Void> cancelOfficeHourSlot(@PathVariable Integer slotId) {
        officeHourService.cancelSlot(slotId);
        return ResponseEntity.noContent().build();
    }
}