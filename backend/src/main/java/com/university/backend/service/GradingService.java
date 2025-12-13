package com.university.backend.service;

import com.university.backend.dto.AssignmentSubmissionDTO;
import com.university.backend.dto.ExamResultDTO;
import com.university.backend.dto.GradeUpdateRequestDTO;
import com.university.backend.model.AssignmentSubmission;
import com.university.backend.model.ExamResult;
import com.university.backend.repository.AssignmentSubmissionRepository;
import com.university.backend.repository.ExamResultRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GradingService {

    @Autowired
    private AssignmentSubmissionRepository assignmentSubmissionRepository;

    @Autowired
    private ExamResultRepository examResultRepository;


    // ========== ASSIGNMENT METHODS ==========

    public List<AssignmentSubmissionDTO> getAssignmentSubmissions(int assignmentId) {
        List<AssignmentSubmission> submissions = assignmentSubmissionRepository.findSubmissionsWithStudent(assignmentId);

        return submissions.stream().map(sub -> {
            // Create DTO from entity
            AssignmentSubmissionDTO dto = new AssignmentSubmissionDTO();
            dto.setAssignmentSubmissionId(sub.getAssignment_submission_id());
            dto.setAssignmentId(sub.getAssignment_id().getAssignmentId());
            dto.setStudentId(sub.getStudent().getUserId());

            dto.setSubmittedAt(sub.getSubmitted_at().toString());
            dto.setAnswer(sub.getAnswer());
            dto.setGrade(sub.getGrade());
            dto.setFeedback(sub.getFeedback());
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public AssignmentSubmissionDTO gradeAssignment(int submissionId, GradeUpdateRequestDTO request) {
        AssignmentSubmission submission = assignmentSubmissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found with ID: " + submissionId));

        // Update entity
        submission.setGrade(request.getGrade() != null ? request.getGrade() : 0);
        submission.setFeedback(request.getFeedback() != null ? request.getFeedback() : "");

        AssignmentSubmission saved = assignmentSubmissionRepository.save(submission);

        // Convert to DTO
        AssignmentSubmissionDTO dto = new AssignmentSubmissionDTO();
        dto.setAssignmentSubmissionId(saved.getAssignment_submission_id());
        dto.setAssignmentId(saved.getAssignment_id().getAssignmentId());
        dto.setStudentId(saved.getStudent().getUserId());

        dto.setSubmittedAt(saved.getSubmitted_at().toString());
        dto.setAnswer(saved.getAnswer());
        dto.setGrade(saved.getGrade());
        dto.setFeedback(saved.getFeedback());

        return dto;
    }

    // ========== EXAM METHODS ==========

    public List<ExamResultDTO> getExamResults(int examId) {
        List<ExamResult> results = examResultRepository.findResultsWithStudent(examId);

        return results.stream().map(res -> {
            // Create DTO from entity
            ExamResultDTO dto = new ExamResultDTO();
            dto.setExamResultId(res.getExam_result());
            dto.setExamId(res.getExam_id().getExamId());
            dto.setStudentId(res.getStudent_id().getUserId());

            dto.setScore(res.getScore());
            dto.setFeedback(res.getFeedback());
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public ExamResultDTO gradeExam(int resultId, GradeUpdateRequestDTO request) {
        ExamResult result = examResultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Exam result not found with ID: " + resultId));

        // Update entity
        result.setScore(request.getScore() != null ? request.getScore() : 0);
        result.setFeedback(request.getFeedback() != null ? request.getFeedback() : "");

        ExamResult saved = examResultRepository.save(result);

        // Convert to DTO
        ExamResultDTO dto = new ExamResultDTO();
        dto.setExamResultId(saved.getExam_result());
        dto.setExamId(saved.getExam_id().getExamId());
        dto.setStudentId(saved.getStudent_id().getUserId());

        dto.setScore(saved.getScore());
        dto.setFeedback(saved.getFeedback());

        return dto;
    }
}