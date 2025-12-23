package com.university.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard/ta")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TADashboardController {

    @GetMapping
    public ResponseEntity<?> getTADashboard(HttpSession session) {
        // Check session
        Integer userID = (Integer) session.getAttribute("userID");
        String userRole = (String) session.getAttribute("userRole");

        System.out.println("TA Dashboard check - UserID: " + userID + ", Role: " + userRole);

        if (userID == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Not logged in");
        }

        if (!"TA".equals(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied. TA role required.");
        }

        // Return mock data for testing
        Map<String, Object> mockData = new HashMap<>();
        mockData.put("taId", 1);
        mockData.put("firstName", "John");
        mockData.put("lastName", "Doe");
        mockData.put("email", "ta@university.edu");
        mockData.put("departmentName", "Computer Science");
        mockData.put("assignedCourses", 3);
        mockData.put("officeHours", 2);

        return ResponseEntity.ok(mockData);
    }
}