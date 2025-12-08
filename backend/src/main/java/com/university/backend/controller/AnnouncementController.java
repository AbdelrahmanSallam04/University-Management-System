package com.university.backend.controller;

import com.university.backend.dto.AnnouncementDTO;
import com.university.backend.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // Adjust for your frontend URL
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @PostMapping("/create")
    public ResponseEntity<String> createAnnouncement(@RequestBody AnnouncementDTO request) {
        announcementService.createAnnouncement(request);
        return ResponseEntity.ok("Announcement created successfully");
    }
}