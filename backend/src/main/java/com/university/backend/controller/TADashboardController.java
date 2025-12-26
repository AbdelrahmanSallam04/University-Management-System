package com.university.backend.controller;

import com.university.backend.service.TADashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard/ta")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TADashboardController {

    private final TADashboardService taService;

    @Autowired
    public TADashboardController(TADashboardService taService) {
        this.taService = taService;
    }

    @GetMapping
    public ResponseEntity<?> getTADashboard(HttpSession session) {
        // Check session
        Integer userID = (Integer) session.getAttribute("userID");
        String userRole = (String) session.getAttribute("userRole");

        System.out.println("TA Dashboard endpoint called - UserID: " + userID + ", Role: " + userRole);

        if (userID == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Not logged in\"}");
        }

        // Try to get TA data regardless of role
        try {
            Map<String, Object> taData = taService.getTADashboardDataAsMap(userID);

            // Check if we got actual TA data
            if (taData.get("success") != null && !(Boolean) taData.get("success")) {
                // TA not found in database
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("{\"error\": \"User is not registered as a Teaching Assistant\"}");
            }

            // Add session info
            taData.put("sessionUserId", userID);
            taData.put("sessionRole", userRole);

            return ResponseEntity.ok(taData);

        } catch (Exception e) {
            System.err.println("Error in TA dashboard: " + e.getMessage());

            // Return minimal error response
            Map<String, Object> errorResponse = new java.util.HashMap<>();
            errorResponse.put("error", "Server error: " + e.getMessage());
            errorResponse.put("userId", userID);
            errorResponse.put("debug", "Check backend application logs");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }

    @GetMapping("/simple")
    public ResponseEntity<?> getSimpleTAData(HttpSession session) {
        Integer userID = (Integer) session.getAttribute("userID");

        if (userID == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Not logged in\"}");
        }

        // Simple response for testing
        Map<String, Object> simpleResponse = new java.util.HashMap<>();
        simpleResponse.put("userId", userID);
        simpleResponse.put("firstName", "Test");
        simpleResponse.put("lastName", "TA");
        simpleResponse.put("email", "test.ta@university.edu");
        simpleResponse.put("departmentName", "Computer Science");
        simpleResponse.put("assignedCourses", 2);
        simpleResponse.put("officeHours", 3);
        simpleResponse.put("accountType", "TA");
        simpleResponse.put("testMode", true);
        simpleResponse.put("message", "This is test data - backend is working");

        return ResponseEntity.ok(simpleResponse);
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkTAAccess(HttpSession session) {
        Integer userID = (Integer) session.getAttribute("userID");
        String userRole = (String) session.getAttribute("userRole");

        Map<String, Object> checkResponse = new java.util.HashMap<>();
        checkResponse.put("userId", userID);
        checkResponse.put("userRole", userRole);
        checkResponse.put("sessionId", session.getId());
        checkResponse.put("taExists", userID != null ? taService.doesTAExist(userID) : false);
        checkResponse.put("timestamp", new java.util.Date());

        return ResponseEntity.ok(checkResponse);
    }
}