package com.university.backend.controller;

import com.university.backend.model.Assignment;
import com.university.backend.model.Exam;
import com.university.backend.service.ProfessorCourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/publishing") // Updated base path to match the controller purpose
public class PublishingAssignmentsAndExamsController {

    private final ProfessorCourseService professorCourseService;

    // Constructor Injection
    public PublishingAssignmentsAndExamsController(ProfessorCourseService professorCourseService) {
        this.professorCourseService = professorCourseService;
    }

    /**
     * Endpoint to publish an assignment.
     * URL: POST /api/publishing/professors/{professorId}/courses/{courseId}/assignments
     */
    @PostMapping("/professors/{professorId}/courses/{courseId}/assignments")
    public ResponseEntity<?> publishAssignment(
            @PathVariable Integer professorId,
            @PathVariable Integer courseId,
            @RequestBody Assignment assignment) {
        try {
            Assignment createdAssignment = professorCourseService.publishAssignment(professorId, courseId, assignment);
            return new ResponseEntity<>(createdAssignment, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Endpoint to publish an exam.
     * URL: POST /api/publishing/professors/{professorId}/courses/{courseId}/exams
     */
    @PostMapping("/professors/{professorId}/courses/{courseId}/exams")
    public ResponseEntity<?> publishExam(
            @PathVariable Integer professorId,
            @PathVariable Integer courseId,
            @RequestBody Exam exam) {
        try {
            Exam createdExam = professorCourseService.publishExam(professorId, courseId, exam);
            return new ResponseEntity<>(createdExam, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}