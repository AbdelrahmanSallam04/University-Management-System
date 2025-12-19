package com.university.backend.controller;

import com.university.backend.dto.AssignmentSubmissionDTO;
import com.university.backend.dto.ExamResultDTO;
import com.university.backend.dto.ExamSubmissionDTO;
import com.university.backend.dto.GradeUpdateRequestDTO;
import com.university.backend.service.GradingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000" , allowCredentials = "true")
public class GradingController {

    @Autowired
    private GradingService gradingService;

    // ========== ASSIGNMENT ENDPOINTS ==========

    @GetMapping("/assignments/{assignmentId}/submissions")
    public ResponseEntity<List<AssignmentSubmissionDTO>> getAssignmentSubmissions(
            @PathVariable int assignmentId) {

        System.out.println("📡 GET /api/assignments/" + assignmentId + "/submissions");

        List<AssignmentSubmissionDTO> submissions =
                gradingService.getAssignmentSubmissions(assignmentId);

        System.out.println("📊 Found " + submissions.size() + " submissions");

        return ResponseEntity.ok(submissions);
    }

    @PutMapping("/assignments/submissions/{submissionId}")
    public ResponseEntity<AssignmentSubmissionDTO> updateAssignmentGrade(
            @PathVariable int submissionId,
            @RequestBody GradeUpdateRequestDTO request) {

        System.out.println("📡 PUT /api/assignments/submissions/" + submissionId);
        System.out.println("📊 Grade: " + request.getGrade() + ", Feedback: " + request.getFeedback());

        AssignmentSubmissionDTO updated = gradingService.gradeAssignment(submissionId, request);

        System.out.println("✅ Successfully updated submission ID: " + updated.getAssignmentSubmissionId());

        return ResponseEntity.ok(updated);
    }

    // ========== EXAM ENDPOINTS ==========
/*
    @GetMapping("/exams/{examId}/results")
    public ResponseEntity<List<ExamResultDTO>> getExamResults(
            @PathVariable int examId) {

        System.out.println("📡 GET /api/exams/" + examId + "/results");

        List<ExamResultDTO> results = gradingService.getExamResults(examId);

        System.out.println("📊 Found " + results.size() + " exam results");

        return ResponseEntity.ok(results);
    }

    @PutMapping("/exams/results/{resultId}")
    public ResponseEntity<ExamResultDTO> updateExamGrade(
            @PathVariable int resultId,
            @RequestBody GradeUpdateRequestDTO request) {

        System.out.println("📡 PUT /api/exams/results/" + resultId);
        System.out.println("📊 Score: " + request.getScore() + ", Feedback: " + request.getFeedback());

        ExamResultDTO updated = gradingService.gradeExam(resultId, request);

      //  System.out.println("✅ Successfully updated exam result ID: " + updated.getExam_result_id());

        return ResponseEntity.ok(updated);
    }
 */

    // Get all submissions for an exam
    @GetMapping("/exams/{examId}/submissions")
    public List<ExamSubmissionDTO> getExamSubmissions(@PathVariable Integer examId) {
        return gradingService.getExamSubmissions(examId);
    }

    // Update grade and feedback for a submission
    @PutMapping("/exams/submissions/{submissionId}")
    public ExamSubmissionDTO gradeExamSubmission(@PathVariable Integer submissionId,
                                             @RequestBody GradeUpdateRequestDTO request) {
        return gradingService.gradeExamSubmission(submissionId, request);
    }

    // ========== HEALTH CHECK ==========

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("✅ Grading API is working!");
    }

    // ========== TEST ENDPOINT ==========

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("🚀 API is running at " + new java.util.Date());
    }
}