package com.university.backend.controller;

import com.university.backend.dto.RegistrationRequestDTO;
import com.university.backend.dto.RegistrationResponseDTO;
import com.university.backend.service.RegistrationService;
import com.university.backend.service.RegistrationService.RegistrationStatusDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/registration")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponseDTO> registerForCourse(
            @RequestBody RegistrationRequestDTO request,
            HttpSession session) {

        Integer studentId = (Integer) session.getAttribute("userID");

        if (studentId == null) {
            RegistrationResponseDTO errorResponse = new RegistrationResponseDTO();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Please login to register for courses");
            return ResponseEntity.status(401).body(errorResponse);
        }

        RegistrationResponseDTO response = registrationService.registerForCourse(studentId, request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/drop")
    public ResponseEntity<RegistrationResponseDTO> dropCourse(
            @RequestBody RegistrationRequestDTO request,
            HttpSession session) {

        Integer studentId = (Integer) session.getAttribute("userID");

        if (studentId == null) {
            RegistrationResponseDTO errorResponse = new RegistrationResponseDTO();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Please login first");
            return ResponseEntity.status(401).body(errorResponse);
        }

        RegistrationResponseDTO response = registrationService.dropCourse(studentId, request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> getRegistrationStatus(HttpSession session) {
        Integer studentId = (Integer) session.getAttribute("userID");

        if (studentId == null) {
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Please login first"
            ));
        }

        try {
            RegistrationStatusDTO status = registrationService.getRegistrationStatus(studentId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "status", status
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }
}