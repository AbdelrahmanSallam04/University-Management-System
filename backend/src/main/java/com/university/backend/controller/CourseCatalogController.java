package com.university.backend.controller;

import com.university.backend.dto.CourseCatalogDTO;
import com.university.backend.service.CourseCatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CourseCatalogController {

    private final CourseCatalogService courseCatalogService;

    /** Get all courses for the catalog page */
    @GetMapping
    public ResponseEntity<List<CourseCatalogDTO>> getAllCourses() {
        List<CourseCatalogDTO> courses = courseCatalogService.getAllCourses();
        return ResponseEntity.ok(courses);
    }
    /** Get a single course by ID for details view */
    @GetMapping("/{courseId}")
    public ResponseEntity<CourseCatalogDTO> getCourseById(@PathVariable Integer courseId) {
        CourseCatalogDTO course = courseCatalogService.getCourseById(courseId);
        return ResponseEntity.ok(course);
    }


    /** Get all course types for filter dropdown */
    @GetMapping("/filters/course-types")
    public ResponseEntity<List<String>> getCourseTypes() {
        List<String> courseTypes = courseCatalogService.getCourseTypes();
        return ResponseEntity.ok(courseTypes);
    }


    /** Get all departments for filter dropdown */
//    @GetMapping("/filters/departments")
//    public ResponseEntity<List<String>> getDepartments() {
//        List<String> departments = courseCatalogService.getDepartments();
//        return ResponseEntity.ok(departments);
//    }
}