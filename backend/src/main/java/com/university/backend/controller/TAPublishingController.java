package com.university.backend.controller;

import com.university.backend.dto.AssignmentDTO;
import com.university.backend.dto.CourseMaterialsResponse;
import com.university.backend.dto.ExamDTO;
import com.university.backend.model.*;
import com.university.backend.service.TAPublishingService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ta")
public class TAPublishingController {

    private final TAPublishingService taPublishingService;

    @Autowired
    public TAPublishingController(TAPublishingService taPublishingService) {
        this.taPublishingService = taPublishingService;
    }

    /**
     * Get all courses that the TA is assigned to assist
     */
    @GetMapping("/courses")
    public ResponseEntity<?> getAssistingCourses(HttpSession session) {
        try {
            Integer taId = (Integer) session.getAttribute("userID");
            if (taId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not logged in");
            }

            List<Course> courses = taPublishingService.getAssistingCourses(taId);
            return ResponseEntity.ok(courses);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching courses: " + e.getMessage());
        }
    }

    /**
     * Publish a new assignment
     */
    @PostMapping("/courses/{courseId}/assignments")
    public ResponseEntity<?> publishAssignment(
            @PathVariable Integer courseId,
            @RequestBody AssignmentDTO assignmentDTO,
            HttpSession session) {
        try {
            Integer taId = (Integer) session.getAttribute("userID");
            if (taId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not logged in");
            }

            Assignment assignment = taPublishingService.publishAssignment(
                    taId, courseId, assignmentDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(assignment);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error publishing assignment: " + e.getMessage());
        }
    }

    /**
     * Publish a new exam
     */
    @PostMapping("/courses/{courseId}/exams")
    public ResponseEntity<?> publishExam(
            @PathVariable Integer courseId,
            @RequestBody ExamDTO examDTO,
            HttpSession session) {
        try {
            Integer taId = (Integer) session.getAttribute("userID");
            if (taId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not logged in");
            }

            Exam exam = taPublishingService.publishExam(taId, courseId, examDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(exam);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error publishing exam: " + e.getMessage());
        }
    }

    /**
     * Get course materials (assignments and exams) for a course
     */
    @GetMapping("/courses/{courseId}/materials")
    public ResponseEntity<?> getCourseMaterials(
            @PathVariable Integer courseId,
            HttpSession session) {
        try {
            Integer taId = (Integer) session.getAttribute("userID");
            if (taId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("User not logged in");
            }

            CourseMaterialsResponse response = taPublishingService.getCourseMaterials(taId, courseId);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching materials: " + e.getMessage());
        }
    }
}