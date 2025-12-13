package com.university.backend.service;

import com.university.backend.dto.SubmitAssignmentDTO;
import com.university.backend.dto.SubmissionDTO;
import com.university.backend.model.*;
import com.university.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AssignmentSubmissionService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final StudentRepository studentRepository;
    private final StudentCourseRepository studentCourseRepository;

    // Submit assignment
    @Transactional
    public SubmissionDTO submitAssignment(Integer studentId, SubmitAssignmentDTO request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Assignment assignment = assignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        // Check if student is enrolled in the course
        boolean isEnrolled = studentCourseRepository.existsByStudentUserIdAndCourseCourseId(
                studentId,
                assignment.getCourse_id().getCourseId());
        if (!isEnrolled) {
            throw new RuntimeException("Student is not enrolled in this course");
        }

        // Check for existing submission
        Optional<AssignmentSubmission> existingSubmission = submissionRepository
                .findByAssignmentIdAndStudentId(request.getAssignmentId(), studentId);

        AssignmentSubmission submission;

        if (existingSubmission.isPresent()) {
            throw new RuntimeException("You have already submitted this assignment. Use update endpoint instead.");
        } else {
            // Create new submission
            submission = new AssignmentSubmission();
            submission.setAssignment_id(assignment);
            submission.setStudent(student);
            submission.setAnswer(request.getSubmissionText());
            submission.setSubmitted_at(LocalDateTime.now());
            submission.setGrade(0);  // Default grade
            submission.setFeedback(""); // Empty feedback initially
        }

        submissionRepository.save(submission);

        // Return submission DTO
        return convertToSubmissionDTO(submission);
    }

    // Update submission
    @Transactional
    public SubmissionDTO updateSubmission(Integer studentId, SubmitAssignmentDTO request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Assignment assignment = assignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        // Check if student is enrolled in the course
        boolean isEnrolled = studentCourseRepository.existsByStudentUserIdAndCourseCourseId(
                studentId, assignment.getCourse_id().getCourseId());
        if (!isEnrolled) {
            throw new RuntimeException("Student is not enrolled in this course");
        }

        // Check for existing submission
        Optional<AssignmentSubmission> existingSubmission = submissionRepository
                .findByAssignmentIdAndStudentId(request.getAssignmentId(), studentId);

        if (existingSubmission.isEmpty()) {
            throw new RuntimeException("No submission found to update. Please submit first.");
        }

        AssignmentSubmission submission = existingSubmission.get();

        // Check if already graded
        if (submission.getGrade() > 0 && submission.getFeedback() != null && !submission.getFeedback().isEmpty()) {
            throw new RuntimeException("Cannot update submission after it has been graded");
        }

        // Update submission
        submission.setAnswer(request.getSubmissionText());
        submission.setSubmitted_at(LocalDateTime.now());

        submissionRepository.save(submission);

        // Return submission DTO
        return convertToSubmissionDTO(submission);
    }

    // Get submission details
    public SubmissionDTO getSubmissionDetails(Integer assignmentId, Integer studentId) {
        Optional<AssignmentSubmission> submission = submissionRepository
                .findByAssignmentIdAndStudentId(assignmentId, studentId);

        if (submission.isEmpty()) {
            throw new RuntimeException("No submission found for this assignment");
        }

        return convertToSubmissionDTO(submission.get());
    }

    // Helper method to convert AssignmentSubmission to SubmissionDTO
    private SubmissionDTO convertToSubmissionDTO(AssignmentSubmission submission) {
        SubmissionDTO dto = new SubmissionDTO();
        dto.setSubmissionId(submission.getAssignment_submission_id());
        dto.setSubmissionText(submission.getAnswer());
        dto.setSubmittedAt(submission.getSubmitted_at());
        dto.setMarksObtained(submission.getGrade());
        dto.setFeedback(submission.getFeedback());

        // Get assignment to check if late
        Assignment assignment = submission.getAssignment_id();
        boolean isLate = submission.getSubmitted_at().isAfter(assignment.getDueDate());
        dto.setLate(isLate);
        dto.setStatus(isLate ? "LATE" : "SUBMITTED");

        return dto;
    }
}