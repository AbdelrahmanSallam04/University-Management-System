package com.university.backend.controller;

import com.university.backend.dto.OfficeHourSlotDTO;
import com.university.backend.dto.StaffMemberDTO;
import com.university.backend.service.StaffDirectoryService;
import jakarta.servlet.http.HttpSession;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff-directory")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class StaffDirectoryController {
    private final StaffDirectoryService staffDirectoryService;

    @GetMapping("/all")
    public ResponseEntity<List<StaffMemberDTO>> getAllStaff() {
        return ResponseEntity.ok(staffDirectoryService.getAllStaff());
    }

    @GetMapping("/professors")
    public ResponseEntity<List<StaffMemberDTO>> getProfessors() {
        return ResponseEntity.ok(staffDirectoryService.getProfessors());
    }

    @GetMapping("/tas")
    public ResponseEntity<List<StaffMemberDTO>> getTAs() {
        return ResponseEntity.ok(staffDirectoryService.getTAs());
    }

    // Changed return type to OfficeHourSlotDTO
    @GetMapping("/{staffId}/office-hours")
    public ResponseEntity<List<OfficeHourSlotDTO>> getOfficeHours(@PathVariable Integer staffId) {
        return ResponseEntity.ok(staffDirectoryService.getOfficeHours(staffId));
    }

    @PostMapping("/slots/{slotId}/book")
    public ResponseEntity<?> bookOfficeHourSlot(
            @PathVariable Long slotId,
            @RequestBody BookSlotRequest request,
            HttpSession session) {
        try {
            // Verify session
            Integer userId = (Integer) session.getAttribute("userID");
            if (userId == null) {
                return ResponseEntity.status(401).body("Please log in to book office hours");
            }

            OfficeHourSlotDTO result = staffDirectoryService.bookOfficeHourSlot(slotId, request.getPurpose());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Getter
    @Setter
    static class BookSlotRequest {
        private String purpose;
    }
}