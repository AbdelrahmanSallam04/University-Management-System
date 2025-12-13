package com.university.backend.controller;

import com.university.backend.dto.SubmitAssignmentDTO;
import com.university.backend.dto.SubmissionDTO;
import com.university.backend.service.AssignmentSubmissionService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/assignment-submissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AssignmentSubmissionController {

    private final AssignmentSubmissionService assignmentSubmissionService;

    // Submit assignment
    @PostMapping("/submit")
    public ResponseEntity<?> submitAssignment(
            @RequestBody SubmitAssignmentDTO request,
            HttpSession session) {

        Integer studentId = (Integer) session.getAttribute("userID");

        if (studentId == null) {
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Please login first"
            ));
        }

        try {
            SubmissionDTO submission = assignmentSubmissionService.submitAssignment(studentId, request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Assignment submitted successfully",
                    "submission", submission
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    // Update submission
    @PutMapping("/update")
    public ResponseEntity<?> updateSubmission(
            @RequestBody SubmitAssignmentDTO request,
            HttpSession session) {

        Integer studentId = (Integer) session.getAttribute("userID");

        if (studentId == null) {
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Please login first"
            ));
        }

        try {
            SubmissionDTO submission = assignmentSubmissionService.updateSubmission(studentId, request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Submission updated successfully",
                    "submission", submission
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    // Get submission details
    @GetMapping("/{assignmentId}")
    public ResponseEntity<?> getSubmissionDetails(
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
            SubmissionDTO submission = assignmentSubmissionService.getSubmissionDetails(assignmentId, studentId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "submission", submission
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }
}