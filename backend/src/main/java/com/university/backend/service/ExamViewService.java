package com.university.backend.service;

import com.university.backend.dto.ExamDTO;
import com.university.backend.dto.ExamDetailsDTO;
import com.university.backend.dto.ExamSubmissionDTO;
import com.university.backend.model.*;
import com.university.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamViewService {

    private final ExamRepository examRepository;
    private final ExamSubmissionRepository examSubmissionRepository;
    private final StudentCourseRepository studentCourseRepository;

    public List<ExamDTO> getExamsForStudent(Integer studentId) {
        List<Course> enrolledCourses = studentCourseRepository.findCoursesById(studentId);
        List<Integer> courseIds = enrolledCourses.stream()
                .map(Course::getCourseId)
                .collect(Collectors.toList());

        if (courseIds.isEmpty()) return List.of();

        List<Exam> exams = examRepository.findByCourseIdIn(courseIds);

        return exams.stream()
                .map(exam -> convertToDTO(exam, studentId))
                .collect(Collectors.toList());
    }

    public List<ExamDTO> getExamsForCourse(Integer studentId, Integer courseId) {
        boolean isEnrolled = studentCourseRepository.existsByStudentUserIdAndCourseCourseId(studentId, courseId);
        if (!isEnrolled) throw new RuntimeException("Student not enrolled");

        List<Exam> exams = examRepository.findByCourseId(courseId);

        return exams.stream()
                .map(exam -> convertToDTO(exam, studentId))
                .collect(Collectors.toList());
    }

    public ExamDetailsDTO getExamDetails(Integer examId, Integer studentId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        boolean isEnrolled = studentCourseRepository.existsByStudentUserIdAndCourseCourseId(
                studentId, exam.getCourse().getCourseId());
        if (!isEnrolled) throw new RuntimeException("Student not enrolled");

        ExamDetailsDTO dto = new ExamDetailsDTO();
        dto.setExamId(exam.getExamId());
        dto.setTitle(exam.getTitle());
        dto.setDescription(exam.getDescription());
        dto.setTotalMarks(exam.getTotalMarks());
        dto.setStartTime(exam.getStartTime());
        dto.setEndTime(exam.getEndTime());
        dto.setDurationMinutes(exam.getDurationMinutes());
        dto.setExamType(exam.getExamType());

        Course course = exam.getCourse();
        dto.setCourseCode(course.getCode());
        dto.setCourseName(course.getName());
        if (course.getProfessor() != null) {
            dto.setProfessorName(course.getProfessor().getFirstName() + " " +
                    course.getProfessor().getLastName());
        }

        Optional<ExamSubmission> submission = examSubmissionRepository
                .findByExamIdAndStudentId(examId, studentId);

        if (submission.isPresent()) {
            ExamSubmissionDTO submissionDTO = new ExamSubmissionDTO();
            ExamSubmission sub = submission.get();
            submissionDTO.setExamSubmissionId(sub.getExamSubmissionId());
            submissionDTO.setAnswers(sub.getAnswers());
            submissionDTO.setSubmittedAt(sub.getSubmittedAt());
            submissionDTO.setObtainedMarks(sub.getObtainedMarks());
            submissionDTO.setFeedback(sub.getFeedback());
            submissionDTO.setStatus(sub.getStatus());
            submissionDTO.setTimeTakenMinutes(sub.getTimeTakenMinutes());
            submissionDTO.setLate(sub.getSubmittedAt().isAfter(exam.getEndTime()));
            dto.setSubmission(submissionDTO);
        }

        return dto;
    }

    private ExamDTO convertToDTO(Exam exam, Integer studentId) {
        ExamDTO dto = new ExamDTO();
        dto.setExamId(exam.getExamId());
        dto.setCourseId(exam.getCourse().getCourseId());
        dto.setCourseCode(exam.getCourse().getCode());
        dto.setCourseName(exam.getCourse().getName());
        dto.setTitle(exam.getTitle());
        dto.setDescription(exam.getDescription());
        dto.setTotalMarks(exam.getTotalMarks());
        dto.setStartTime(exam.getStartTime());
        dto.setEndTime(exam.getEndTime());
        dto.setDurationMinutes(exam.getDurationMinutes());
        dto.setExamType(exam.getExamType());

        boolean attempted = examSubmissionRepository.existsByExamIdAndStudentId(exam.getExamId(), studentId);
        dto.setAttempted(attempted);

        if (attempted) {
            Optional<ExamSubmission> submission = examSubmissionRepository
                    .findByExamIdAndStudentId(exam.getExamId(), studentId);
            submission.ifPresent(s -> {
                dto.setObtainedMarks(s.getObtainedMarks());
                dto.setSubmissionStatus(s.getStatus());
            });
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(exam.getStartTime())) {
            dto.setStatus("upcoming");
            Duration duration = Duration.between(now, exam.getStartTime());
            long days = duration.toDays();
            long hours = duration.toHours() % 24;
            dto.setTimeRemaining(days > 0 ? days + " days" : hours + " hours");
        } else if (now.isAfter(exam.getEndTime())) {
            dto.setStatus("past");
            dto.setTimeRemaining("Completed");
        } else {
            dto.setStatus("ongoing");
            Duration duration = Duration.between(now, exam.getEndTime());
            long hours = duration.toHours();
            long minutes = duration.toMinutes() % 60;
            dto.setTimeRemaining(hours + "h " + minutes + "m");
        }

        return dto;
    }
}