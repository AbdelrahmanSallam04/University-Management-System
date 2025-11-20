package com.university.backend.controller;

import com.university.backend.dto.StudentDashboardDTO;
import com.university.backend.service.StudentDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@CrossOrigin(origins ="http://localhost:3000") // Your frontend URL
public class StudentDashboardController {

    private final StudentDashboardService studentDashboardService;

    @GetMapping("/dashboard/{userId}")
    public ResponseEntity<StudentDashboardDTO> getStudentDashboard(@PathVariable Long userId) {
        StudentDashboardDTO dashboard = studentDashboardService.getStudentDashboard(userId);
        return ResponseEntity.ok(dashboard);
    }
}
