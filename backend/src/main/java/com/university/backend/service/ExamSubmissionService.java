package com.university.backend.service;

import com.university.backend.dto.ExamSubmissionDTO;
import com.university.backend.dto.SubmitExamDTO;
import com.university.backend.model.*;
import com.university.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ExamSubmissionService {

    private final ExamRepository examRepository;
    private final ExamSubmissionRepository examSubmissionRepository;
    private final StudentRepository studentRepository;
    private final StudentCourseRepository studentCourseRepository;

    @Transactional
    public ExamSubmissionDTO startExam(Integer studentId, Integer examId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        boolean isEnrolled = studentCourseRepository.existsByStudentUserIdAndCourseCourseId(
                studentId, exam.getCourse().getCourseId());
        if (!isEnrolled) throw new RuntimeException("Student not enrolled");

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(exam.getStartTime())) {
            throw new RuntimeException("Exam starts at: " + exam.getStartTime());
        }
        if (now.isAfter(exam.getEndTime())) {
            throw new RuntimeException("Exam ended at: " + exam.getEndTime());
        }

        Optional<ExamSubmission> existing = examSubmissionRepository
                .findByExamIdAndStudentId(examId, studentId);

        if (existing.isPresent()) {
            ExamSubmission submission = existing.get();
            if ("SUBMITTED".equals(submission.getStatus()) || "GRADED".equals(submission.getStatus())) {
                throw new RuntimeException("Already submitted");
            }
            submission.setStatus("IN_PROGRESS");
            examSubmissionRepository.save(submission);
            return convertToDTO(submission);
        }

        ExamSubmission submission = new ExamSubmission();
        submission.setExam(exam);
        submission.setStudent(student);
        submission.setSubmittedAt(now);
        submission.setStatus("IN_PROGRESS");
        submission.setAnswers("");
        submission.setTimeTakenMinutes(0);
        submission.setObtainedMarks(0);
        submission.setFeedback("");

        examSubmissionRepository.save(submission);
        return convertToDTO(submission);
    }

    @Transactional
    public ExamSubmissionDTO submitExam(Integer studentId, SubmitExamDTO request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        boolean isEnrolled = studentCourseRepository.existsByStudentUserIdAndCourseCourseId(
                studentId, exam.getCourse().getCourseId());
        if (!isEnrolled) throw new RuntimeException("Student not enrolled");

        Optional<ExamSubmission> existing = examSubmissionRepository
                .findByExamIdAndStudentId(request.getExamId(), studentId);

        if (existing.isEmpty()) throw new RuntimeException("Start exam first");

        ExamSubmission submission = existing.get();
        submission.setAnswers(request.getAnswers());
        submission.setTimeTakenMinutes(request.getTimeTakenMinutes());
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setStatus(submission.getSubmittedAt().isAfter(exam.getEndTime()) ? "LATE" : "SUBMITTED");

        examSubmissionRepository.save(submission);
        return convertToDTO(submission);
    }

    private ExamSubmissionDTO convertToDTO(ExamSubmission submission) {
        ExamSubmissionDTO dto = new ExamSubmissionDTO();
        dto.setExamSubmissionId(submission.getExamSubmissionId());
        dto.setAnswers(submission.getAnswers());
        dto.setSubmittedAt(submission.getSubmittedAt());
        dto.setObtainedMarks(submission.getObtainedMarks());
        dto.setFeedback(submission.getFeedback());
        dto.setStatus(submission.getStatus());
        dto.setTimeTakenMinutes(submission.getTimeTakenMinutes());
        dto.setLate(submission.getSubmittedAt().isAfter(submission.getExam().getEndTime()));
        return dto;
    }
}