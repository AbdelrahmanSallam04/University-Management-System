// src/main/java/com.university.backend.controller/StudentController.java (MODIFIED)

package com.university.backend.controller;

import com.university.backend.dto.EnrolledCourseDTO; // New Import
import com.university.backend.model.Course;
import com.university.backend.service.Mapping_Enrolled_Service;
import com.university.backend.service.Student_Enrolled_Classes_Service;
import com.university.backend.service.Mapping_Enrolled_Service; // New Import
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
// ... other imports

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/students")
public class StudentController {

    private final Student_Enrolled_Classes_Service studentService;
    private final Mapping_Enrolled_Service mappingService; // Inject the mapper

    public StudentController(Student_Enrolled_Classes_Service studentService, Mapping_Enrolled_Service mappingService) {
        this.studentService = studentService;
        this.mappingService = mappingService;
    }

    @GetMapping("/me/courses")
    public ResponseEntity<Set<EnrolledCourseDTO>> getMyEnrolledCourses(HttpSession session) {

        // ✅ Get userId from session
        String userIdStr = String.valueOf(session.getAttribute("userID"));
        if (userIdStr == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Integer authenticatedStudentId = Integer.valueOf(userIdStr);

        // Fetch enrolled courses
        List<Course> courses = studentService.getEnrolledCourses(authenticatedStudentId);

        // Convert to DTO
        Set<EnrolledCourseDTO> courseDTOs = courses.stream()
                .map(mappingService::toCourseDTO)
                .collect(Collectors.toSet());

        return ResponseEntity.ok(courseDTOs);
    }
}