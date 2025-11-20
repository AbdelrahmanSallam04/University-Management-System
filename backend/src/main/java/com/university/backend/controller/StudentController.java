// src/main/java/com.university.backend.controller/StudentController.java (MODIFIED)

package com.university.backend.controller;

import com.university.backend.dto.CourseDTO; // New Import
import com.university.backend.model.Course;
import com.university.backend.service.StudentService;
import com.university.backend.service.MappingService; // New Import
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
// ... other imports

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/students")
public class StudentController {

    private final StudentService studentService;
    private final MappingService mappingService; // Inject the mapper

    public StudentController(StudentService studentService, MappingService mappingService) {
        this.studentService = studentService;
        this.mappingService = mappingService;
    }

    @GetMapping("/me/courses")
    // NOTE: Change the return type to Set<CourseDTO>
    public ResponseEntity<Set<CourseDTO>> getMyEnrolledCourses(HttpSession session) {

        // ... (Session/ID logic here)
        Integer authenticatedStudentId = 100; // Still using hardcoded ID for testing

        if (authenticatedStudentId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Set<Course> courses = studentService.getEnrolledCourses(authenticatedStudentId);

        // --- CONVERSION STEP ---
        // Convert the Set of Course Entities to a Set of Course DTOs
        Set<CourseDTO> courseDTOs = courses.stream()
                .map(mappingService::toCourseDTO)
                .collect(Collectors.toSet());
        // -----------------------

        return ResponseEntity.ok(courseDTOs);
    }
}