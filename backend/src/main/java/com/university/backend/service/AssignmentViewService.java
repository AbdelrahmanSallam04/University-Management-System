package com.university.backend.service;

import com.university.backend.dto.AssignmentDTO;
import com.university.backend.dto.AssignmentDetailsDTO;
import com.university.backend.dto.SubmissionDTO;
import com.university.backend.model.*;
import com.university.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentViewService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final StudentCourseRepository studentCourseRepository;

    // Get all assignments for a student
    public List<AssignmentDTO> getAssignmentsForStudent(Integer studentId) {
        // Get courses the student is enrolled in
        List<Course> enrolledCourses = studentCourseRepository.findCoursesById(studentId);
        List<Integer> courseIds = enrolledCourses.stream()
                .map(Course::getCourseId)
                .collect(Collectors.toList());

        if (courseIds.isEmpty()) {
            return List.of();
        }

        // Get assignments for those courses
        List<Assignment> assignments = assignmentRepository.findByCourseIdIn(courseIds);

        return assignments.stream()
                .map(assignment -> convertToDTO(assignment, studentId))
                .collect(Collectors.toList());
    }

    // Get assignments for a specific course
    public List<AssignmentDTO> getAssignmentsForCourse(Integer studentId, Integer courseId) {
        // Check if student is enrolled in the course
        boolean isEnrolled = studentCourseRepository.existsByStudentUserIdAndCourseCourseId(studentId, courseId);
        if (!isEnrolled) {
            throw new RuntimeException("Student is not enrolled in this course");
        }

        List<Assignment> assignments = assignmentRepository.findByCourseId(courseId);

        return assignments.stream()
                .map(assignment -> convertToDTO(assignment, studentId))
                .collect(Collectors.toList());
    }

    // Get assignment details
    public AssignmentDetailsDTO getAssignmentDetails(Integer assignmentId, Integer studentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        // Check if student is enrolled in the course
        boolean isEnrolled = studentCourseRepository.existsByStudentUserIdAndCourseCourseId(
                studentId, assignment.getCourse_id().getCourseId());
        if (!isEnrolled) {
            throw new RuntimeException("Student is not enrolled in this course");
        }

        AssignmentDetailsDTO dto = new AssignmentDetailsDTO();
        dto.setAssignmentId(assignment.getAssignmentId());
        dto.setTitle(assignment.getTitle());
        dto.setDescription(assignment.getDescription());
        dto.setDueDate(assignment.getDueDate());
        dto.setTotalMarks(assignment.getMarks());

        // Course info
        Course course = assignment.getCourse_id();
        dto.setCourseId(course.getCourseId());
        dto.setCourseCode(course.getCode());
        dto.setCourseName(course.getName());
        if (course.getProfessor() != null) {
            dto.setProfessorName(course.getProfessor().getFirstName() + " " +
                    course.getProfessor().getLastName());
        }

        // Check for existing submission
        Optional<AssignmentSubmission> existingSubmission = submissionRepository
                .findByAssignmentIdAndStudentId(assignmentId, studentId);

        if (existingSubmission.isPresent()) {
            SubmissionDTO submissionDTO = new SubmissionDTO();
            AssignmentSubmission submission = existingSubmission.get();
            submissionDTO.setSubmissionId(submission.getAssignment_submission_id());
            submissionDTO.setSubmissionText(submission.getAnswer());
            submissionDTO.setSubmittedAt(submission.getSubmitted_at());
            submissionDTO.setMarksObtained(submission.getGrade());
            submissionDTO.setFeedback(submission.getFeedback());

            // Determine status based on due date
            boolean isLate = submission.getSubmitted_at().isAfter(assignment.getDueDate());
            submissionDTO.setLate(isLate);
            submissionDTO.setStatus(isLate ? "LATE" : "SUBMITTED");

            dto.setSubmission(submissionDTO);
        }

        return dto;
    }

    // Get submission details for a specific assignment
    public SubmissionDTO getSubmissionDetails(Integer assignmentId, Integer studentId) {
        Optional<AssignmentSubmission> submission = submissionRepository
                .findByAssignmentIdAndStudentId(assignmentId, studentId);

        if (submission.isEmpty()) {
            throw new RuntimeException("No submission found for this assignment");
        }

        AssignmentSubmission sub = submission.get();
        SubmissionDTO submissionDTO = new SubmissionDTO();
        submissionDTO.setSubmissionId(sub.getAssignment_submission_id());
        submissionDTO.setSubmissionText(sub.getAnswer());
        submissionDTO.setSubmittedAt(sub.getSubmitted_at());
        submissionDTO.setMarksObtained(sub.getGrade());
        submissionDTO.setFeedback(sub.getFeedback());

        // Get assignment to check if late
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        boolean isLate = sub.getSubmitted_at().isAfter(assignment.getDueDate());
        submissionDTO.setLate(isLate);
        submissionDTO.setStatus(isLate ? "LATE" : "SUBMITTED");

        return submissionDTO;
    }

    // Helper method to convert Assignment to DTO
    private AssignmentDTO convertToDTO(Assignment assignment, Integer studentId) {
        AssignmentDTO dto = new AssignmentDTO();
        dto.setAssignmentId(assignment.getAssignmentId());
        dto.setCourseId(assignment.getCourse_id().getCourseId());
        dto.setCourseCode(assignment.getCourse_id().getCode());
        dto.setCourseName(assignment.getCourse_id().getName());
        dto.setTitle(assignment.getTitle());
        dto.setDescription(assignment.getDescription());
        dto.setDueDate(assignment.getDueDate());
        dto.setTotalMarks(assignment.getMarks());

        // Check submission status
        boolean hasSubmitted = submissionRepository.existsByAssignmentIdAndStudentId(
                assignment.getAssignmentId(), studentId);
        dto.setSubmitted(hasSubmitted);

        if (hasSubmitted) {
            Optional<AssignmentSubmission> submission = submissionRepository
                    .findByAssignmentIdAndStudentId(assignment.getAssignmentId(), studentId);
            submission.ifPresent(s -> {
                dto.setMarksObtained(s.getGrade());
                dto.setSubmittedAt(s.getSubmitted_at());
            });
        }

        // Determine assignment status based on due date
        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(assignment.getDueDate())) {
            dto.setStatus("past_due");
        } else if (now.isBefore(assignment.getDueDate().minusDays(7))) {
            dto.setStatus("upcoming");
        } else {
            dto.setStatus("active");
        }

        return dto;
    }
}