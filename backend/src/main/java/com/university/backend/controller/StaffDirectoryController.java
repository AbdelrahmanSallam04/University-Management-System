package com.university.backend.controller;

import com.university.backend.dto.OfficeHoursDTO;
import com.university.backend.dto.StaffMemberDTO;
import com.university.backend.service.StaffDirectoryService;
import lombok.RequiredArgsConstructor;
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

    @GetMapping("/{staffId}/office-hours")
    public ResponseEntity<List<OfficeHoursDTO>> getOfficeHours(@PathVariable Integer staffId) {
        return ResponseEntity.ok(staffDirectoryService.getOfficeHours(Math.toIntExact(Long.valueOf(staffId))));
    }
}