

package com.university.backend.controller;

import com.university.backend.dto.ParentDashboardDTO;
import com.university.backend.dto.StudentDTO;
import com.university.backend.dto.AssignmentSubmissionDTO;
import com.university.backend.dto.ExamSubmissionDTO;
import com.university.backend.service.ParentDashboardService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard/parent")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ParentDashboardController {

    private final ParentDashboardService parentDashboardService;

    public ParentDashboardController(ParentDashboardService parentDashboardService) {
        this.parentDashboardService = parentDashboardService;
    }

    @GetMapping
    public ResponseEntity<ParentDashboardDTO> getParentDashboard(HttpSession session) {
        Integer userID = (Integer) session.getAttribute("userID");
        String userRole = (String) session.getAttribute("userRole");

        if (userID == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!"PARENT".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            ParentDashboardDTO dashboardData = parentDashboardService.getParentDashboardData(userID);
            return ResponseEntity.ok(dashboardData);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Parent with ID") || e.getMessage().contains("Parent not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            if (e.getMessage().contains("No children found")) {
                // Return empty dashboard with parent info
                return ResponseEntity.ok(new ParentDashboardDTO());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/children")
    public ResponseEntity<List<StudentDTO>> getChildren(HttpSession session) {
        Integer userID = (Integer) session.getAttribute("userID");
        String userRole = (String) session.getAttribute("userRole");

        if (userID == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!"PARENT".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }


        try {
            List<StudentDTO> children = parentDashboardService.getChildren(userID);
            return ResponseEntity.ok(children);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/assignments/{studentId}")
    public ResponseEntity<List<AssignmentSubmissionDTO>> getChildAssignments(
            @PathVariable Integer studentId,
            HttpSession session) {

        Integer userID = (Integer) session.getAttribute("userID");
        String userRole = (String) session.getAttribute("userRole");

        if (userID == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!"PARENT".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            List<AssignmentSubmissionDTO> assignments = parentDashboardService.getChildAssignments(studentId);
            return ResponseEntity.ok(assignments);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/grades/{studentId}")
    public ResponseEntity<List<ExamSubmissionDTO>> getChildGrades(
            @PathVariable Integer studentId,
            HttpSession session) {

        Integer userID = (Integer) session.getAttribute("userID");
        String userRole = (String) session.getAttribute("userRole");

        if (userID == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!"PARENT".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            List<ExamSubmissionDTO> grades = parentDashboardService.getChildGrades(studentId);
            return ResponseEntity.ok(grades);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}