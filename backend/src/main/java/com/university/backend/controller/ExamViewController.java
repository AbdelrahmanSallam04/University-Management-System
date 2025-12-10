package com.university.backend.controller;

import com.university.backend.dto.ExamDTO;
import com.university.backend.dto.ExamDetailsDTO;
import com.university.backend.service.ExamViewService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ExamViewController {

    private final ExamViewService examViewService;

    @GetMapping("/my-exams")
    public ResponseEntity<List<ExamDTO>> getMyExams(HttpSession session) {
        Integer studentId = (Integer) session.getAttribute("userID");
        if (studentId == null) return ResponseEntity.status(401).build();

        List<ExamDTO> exams = examViewService.getExamsForStudent(studentId);
        return ResponseEntity.ok(exams);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getCourseExams(
            @PathVariable Integer courseId,
            HttpSession session) {

        Integer studentId = (Integer) session.getAttribute("userID");
        if (studentId == null) return ResponseEntity.status(401).body(Map.of(
                "success", false, "message", "Please login first"));

        try {
            List<ExamDTO> exams = examViewService.getExamsForCourse(studentId, courseId);
            return ResponseEntity.ok(exams);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/{examId}")
    public ResponseEntity<?> getExamDetails(
            @PathVariable Integer examId,
            HttpSession session) {

        Integer studentId = (Integer) session.getAttribute("userID");
        if (studentId == null) return ResponseEntity.status(401).body(Map.of(
                "success", false, "message", "Please login first"));

        try {
            ExamDetailsDTO details = examViewService.getExamDetails(examId, studentId);
            return ResponseEntity.ok(Map.of("success", true, "exam", details));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false, "message", e.getMessage()));
        }
    }
}