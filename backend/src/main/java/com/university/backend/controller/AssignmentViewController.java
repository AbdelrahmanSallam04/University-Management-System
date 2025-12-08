package com.university.backend.controller;

import com.university.backend.dto.*;
import com.university.backend.service.AssignmentViewService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")

public class AssignmentViewController {

    private final AssignmentViewService assignmentViewService;

    // Get all assignments for the logged-in student
    @GetMapping("/my-assignments")
    public ResponseEntity<List<AssignmentDTO>> getMyAssignments(HttpSession session) {
        Integer studentId = (Integer) session.getAttribute("userID");

        if (studentId == null) {
            return ResponseEntity.status(401).build();
        }

        List<AssignmentDTO> assignments = assignmentViewService.getAssignmentsForStudent(studentId);
        return ResponseEntity.ok(assignments);
    }

    // Get assignments for a specific course
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getCourseAssignments(
            @PathVariable Integer courseId,
            HttpSession session) {

        Integer studentId = (Integer) session.getAttribute("userID");

        if (studentId == null) {
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Please login first"
            ));
        }

        try {
            List<AssignmentDTO> assignments = assignmentViewService.getAssignmentsForCourse(studentId, courseId);
            return ResponseEntity.ok(assignments);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    // Get assignment details
    @GetMapping("/{assignmentId}")
    public ResponseEntity<?> getAssignmentDetails(
            @PathVariable Integer assignmentId,
            HttpSession session) {

        Integer studentId = (Integer) session.getAttribute("userID");

        if (studentId == null) {
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Please login first"
            ));
        }

        try {
            AssignmentDetailsDTO details = assignmentViewService.getAssignmentDetails(assignmentId, studentId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "assignment", details
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }
}