package com.university.backend.controller;

import com.university.backend.dto.ExamSubmissionDTO;
import com.university.backend.dto.SubmitExamDTO;
import com.university.backend.service.ExamSubmissionService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/exam-submissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ExamSubmissionController {

    private final ExamSubmissionService examSubmissionService;

    @PostMapping("/{examId}/start")
    public ResponseEntity<?> startExam(
            @PathVariable Integer examId,
            HttpSession session) {

        Integer studentId = (Integer) session.getAttribute("userID");
        if (studentId == null) return ResponseEntity.status(401).body(Map.of(
                "success", false, "message", "Please login first"));

        try {
            ExamSubmissionDTO submission = examSubmissionService.startExam(studentId, examId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Exam started",
                    "submission", submission
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitExam(
            @RequestBody SubmitExamDTO request,
            HttpSession session) {

        Integer studentId = (Integer) session.getAttribute("userID");
        if (studentId == null) return ResponseEntity.status(401).body(Map.of(
                "success", false, "message", "Please login first"));

        try {
            ExamSubmissionDTO submission = examSubmissionService.submitExam(studentId, request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Exam submitted",
                    "submission", submission
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false, "message", e.getMessage()));
        }
    }
}