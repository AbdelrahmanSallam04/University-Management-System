// src/main/java/com.university.backend.controller/StudentController.java

package com.university.backend.controller;

import com.university.backend.model.Course;
import com.university.backend.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpSession; // Required to access session data
import org.springframework.http.HttpStatus;

import java.util.Set;

@RestController
@RequestMapping("/api/v1/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/me/courses")
    public ResponseEntity<Set<Course>> getMyEnrolledCourses(HttpSession session) {

        // 1. Retrieve the student ID (as an Integer) directly from the session
        // NOTE: The attribute key ("user_id") must match the key used in your AuthController.
        Integer authenticatedStudentId = (Integer) session.getAttribute("user_id");

        // 2. Authorization Check: Is the user authenticated?
        if (authenticatedStudentId == null) {
            // The session exists, but the user_id attribute is missing (not logged in)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401 Unauthorized
        }

        // 3. Pass the VERIFIED Integer ID to the Service
        Set<Course> courses = studentService.getEnrolledCourses(authenticatedStudentId);

        return ResponseEntity.ok(courses);
    }
}