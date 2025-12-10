package com.university.backend.controller;

import com.university.backend.dto.CourseMaterialsResponse;
import com.university.backend.service.ProfessorCourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses") // Updated route to be more intuitive
@CrossOrigin(origins = "http://localhost:3000")
public class CourseMaterialController {

    @Autowired
    private ProfessorCourseService professorService;

    // Endpoint: GET /api/courses/{courseId}/materials
    // This allows you to "View Assignments and Exams"
    @GetMapping("/{courseId}/materials")
    public ResponseEntity<CourseMaterialsResponse> getCourseMaterials(@PathVariable Long courseId) {
        CourseMaterialsResponse response = professorService.getCourseMaterials(courseId);
        return ResponseEntity.ok(response);
    }
}