package com.university.backend.controller;

import com.university.backend.dto.ProfessorDashboardDTO;
import com.university.backend.service.ProfessorDashboardService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/dashboard/professor")
// It's good practice to repeat the CORS settings if needed, or rely on a global config
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProfessorDashboardController {

    private final ProfessorDashboardService professorDashboardService;

    public ProfessorDashboardController(ProfessorDashboardService professorDashboardService) {
        this.professorDashboardService = professorDashboardService;
    }

    /**
     * Retrieves all dashboard data for the currently logged-in professor.
     * The professor's ID is retrieved from the HttpSession, set during login.
     * * @param session The current HTTP session.
     * @return ResponseEntity with ProfessorDashboardDTO or an error status.
     */
    @GetMapping
    public ResponseEntity<ProfessorDashboardDTO> getProfessorDashboard(HttpSession session) {

        // 1. Retrieve Professor's User ID from the session
        // The AuthController stores the User ID as a String.
        String userIDString = (String) session.getAttribute("userID");
        String userRole = (String) session.getAttribute("userRole");

        // --- Basic Validation and Authorization ---

        if (userIDString == null) {
            // No User ID in session means the user is not logged in or session expired
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Optional: Ensure only Professors can access this endpoint
        if (!"PROFESSOR".equals(userRole)) {
            // User is logged in but is not a Professor
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            // 2. Convert the String User ID from session to the Integer type required by the service
            // Note: Your service uses Integer for the parameter, but converts it to Long for repository.
            Integer professorId = Integer.parseInt(userIDString);

            // 3. Call the Service to get the aggregated dashboard data
            ProfessorDashboardDTO dashboardData = professorDashboardService.getProfessorDashboardData(professorId);

            // 4. Return the data with an OK status
            return ResponseEntity.ok(dashboardData);

        } catch (NumberFormatException e) {
            // Handle case where the stored userID is not a valid number
            System.err.println("Session userID is not a valid number: " + userIDString);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (RuntimeException e) {
            // Catch the 'Professor not found' exception thrown by the service
            if (e.getMessage().contains("Professor with ID")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            // Catch other unexpected runtime errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}