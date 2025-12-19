package com.university.backend.controller;

import com.university.backend.dto.MaintenanceRequestDTO;
import com.university.backend.dto.MaintenanceResponseDTO;
import com.university.backend.dto.UpdatePriorityDTO;
import com.university.backend.dto.UpdateStatusDTO;
import com.university.backend.service.MaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;


import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }
    // 1. Faculty: Submit a Report
    @PostMapping("/report")
    public ResponseEntity<String> createReport(@RequestBody MaintenanceRequestDTO dto,  HttpSession session) {
        // In a real app, you get the reporterId from the SecurityContext
        // For now, let's assume a helper method gets the current user's ID
        Integer reporterId = (Integer) session.getAttribute("userID");

        if (reporterId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session expired. Please log in again.");
        }

        try {
            maintenanceService.createReport(dto, reporterId);
            return ResponseEntity.ok("Report submitted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    // 2. Admin: Get all reports for the dashboard
    @GetMapping("/all")
    public ResponseEntity<List<MaintenanceResponseDTO>> getAllReports() {
        return ResponseEntity.ok(maintenanceService.getAllReports());
    }

    // 3. Admin: Update Status (This assigns the admin to the report)
    @PatchMapping("/update-status")
    public ResponseEntity<String> updateStatus(@RequestBody UpdateStatusDTO dto, HttpSession session) {
        try {
            Integer adminId = (Integer) session.getAttribute("userID");
            if (adminId == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Session expired. Please log in again.");
            }

            maintenanceService.updateStatus(dto, adminId);
            return ResponseEntity.ok("Status updated and report assigned to you");
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating status: " + e.getMessage());
        }
    }

    // 4. Admin: Update Priority (Does not change the assigned admin)
    @PatchMapping("/update-priority")
    public ResponseEntity<String> updatePriority(@RequestBody UpdatePriorityDTO dto) {
        try {
            if (dto.getId() == null || dto.getPriorityId() == null) {
                return ResponseEntity.badRequest().body("Invalid request data");
            }

            maintenanceService.updatePriority(dto);
            return ResponseEntity.ok("Priority updated successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating priority: " + e.getMessage());
        }
    }

}
