package com.university.backend.controller;

import com.university.backend.dto.StudentDashboardDTO;
import com.university.backend.service.StudentDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@CrossOrigin(origins ="http://localhost:3000") // Your frontend URL
public class StudentDashboardController {

    private final StudentDashboardService studentDashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<StudentDashboardDTO> getStudentDashboard(HttpSession session) {
        long userID = Long.parseLong((String) session.getAttribute("userID"));
        StudentDashboardDTO dashboard = studentDashboardService.getStudentDashboard(userID);
        return ResponseEntity.ok(dashboard);
    }
}
