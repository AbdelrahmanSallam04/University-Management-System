package com.university.backend.controller;

import com.university.backend.dto.AnnouncementDTO;
import com.university.backend.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    // Existing function preserved
    @PostMapping("/create")
    public ResponseEntity<String> createAnnouncement(@RequestBody AnnouncementDTO request) {
        announcementService.createAnnouncement(request);
        return ResponseEntity.ok("Announcement created successfully");
    }

    // NEW: Fetch all announcements for the card list
    @GetMapping("/all")
    public ResponseEntity<List<AnnouncementDTO>> getAllAnnouncements() {
        List<AnnouncementDTO> announcements = announcementService.getAllAnnouncements();
        return ResponseEntity.ok(announcements);
    }

    // NEW: Fetch a single announcement by ID for the details page
    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementDTO> getAnnouncementById(@PathVariable Integer id) {
        AnnouncementDTO announcement = announcementService.getAnnouncementById(id);
        return ResponseEntity.ok(announcement);
    }
}