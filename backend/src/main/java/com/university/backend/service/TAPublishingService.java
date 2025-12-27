package com.university.backend.service;

import com.university.backend.dto.AssignmentDTO;
import com.university.backend.dto.CourseMaterialsResponse;
import com.university.backend.dto.ExamDTO;
import com.university.backend.model.*;
import com.university.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TAPublishingService {

    private final AssignmentRepository assignmentRepository;
    private final ExamRepository examRepository;
    private final CourseRepository courseRepository;
    private final TARepository taRepository;

    @Autowired
    public TAPublishingService(AssignmentRepository assignmentRepository,
                               ExamRepository examRepository,
                               CourseRepository courseRepository,
                               TARepository taRepository) {
        this.assignmentRepository = assignmentRepository;
        this.examRepository = examRepository;
        this.courseRepository = courseRepository;
        this.taRepository = taRepository;
    }

    /**
     * Get all courses that a TA is assigned to assist
     */
    @Transactional(readOnly = true)
    public List<Course> getAssistingCourses(Integer taId) {
        TA ta = taRepository.findById(taId)
                .orElseThrow(() -> new RuntimeException("TA not found with ID: " + taId));
        return ta.getAssistingCourses();
    }

    /**
     * Check if TA is assigned to assist a specific course
     */
    private boolean isTAAssignedToCourse(Integer taId, Integer courseId) {
        TA ta = taRepository.findById(taId)
                .orElseThrow(() -> new RuntimeException("TA not found with ID: " + taId));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));

        return ta.getAssistingCourses().contains(course);
    }

    /**
     * Publish a new assignment
     */
    @Transactional
    public Assignment publishAssignment(Integer taId, Integer courseId, AssignmentDTO assignmentDTO) {
        // Check if TA is assigned to the course
        if (!isTAAssignedToCourse(taId, courseId)) {
            throw new RuntimeException("TA is not assigned to this course");
        }

        // Get the course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));

        // Create new assignment
        Assignment assignment = new Assignment();
        assignment.setTitle(assignmentDTO.getTitle());
        assignment.setDescription(assignmentDTO.getDescription());
        assignment.setMarks(assignmentDTO.getTotalMarks());
        assignment.setDueDate(assignmentDTO.getDueDate());
        assignment.setCourse(course);
        assignment.setCreatedAt(LocalDateTime.now());

        // Save and return
        return assignmentRepository.save(assignment);
    }

    /**
     * Publish a new exam
     */
    @Transactional
    public Exam publishExam(Integer taId, Integer courseId, ExamDTO examDTO) {
        // Check if TA is assigned to the course
        if (!isTAAssignedToCourse(taId, courseId)) {
            throw new RuntimeException("TA is not assigned to this course");
        }

        // Get the course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));

        // Create new exam
        Exam exam = new Exam();
        exam.setTitle(examDTO.getTitle());
        exam.setDescription(examDTO.getDescription());
        exam.setTotalMarks(examDTO.getTotalMarks());
        exam.setStartTime(examDTO.getStartTime());
        exam.setEndTime(examDTO.getEndTime());
        exam.setExamType(examDTO.getExamType());
        exam.setDurationMinutes(examDTO.getDurationMinutes());
        exam.setCourse(course);

        // Save and return
        return examRepository.save(exam);
    }

    /**
     * Get all materials for a course (assignments and exams)
     */
    @Transactional(readOnly = true)
    public CourseMaterialsResponse getCourseMaterials(Integer taId, Integer courseId) {
        // Check if TA is assigned to the course
        if (!isTAAssignedToCourse(taId, courseId)) {
            throw new RuntimeException("TA is not assigned to this course");
        }

        // Get the course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));

        // Get assignments and exams
        List<Assignment> assignments = assignmentRepository.findByCourseId(courseId);
        List<Exam> exams = examRepository.findByCourseCourseId(courseId);

        // Convert entities to DTOs
        List<CourseMaterialsResponse.AssignmentResponse> assignmentDTOs = assignments.stream()
                .map(this::convertToAssignmentResponse)
                .collect(Collectors.toList());

        List<CourseMaterialsResponse.ExamResponse> examDTOs = exams.stream()
                .map(this::convertToExamResponse)
                .collect(Collectors.toList());

        // Create response
        CourseMaterialsResponse response = new CourseMaterialsResponse();
        response.setCourseName(course.getName());
        response.setCourseCode(course.getCode());
        response.setAssignments(assignmentDTOs);
        response.setExams(examDTOs);

        return response;
    }

    // Helper method to convert Assignment entity to AssignmentResponse DTO
    private CourseMaterialsResponse.AssignmentResponse convertToAssignmentResponse(Assignment assignment) {
        CourseMaterialsResponse.AssignmentResponse dto = new CourseMaterialsResponse.AssignmentResponse();
        dto.setId((long) assignment.getAssignmentId());
        dto.setTitle(assignment.getTitle());
        dto.setDescription(assignment.getDescription());
        dto.setDueDate(assignment.getDueDate());
        dto.setMarks(assignment.getMarks());
        return dto;
    }

    // Helper method to convert Exam entity to ExamResponse DTO
    private CourseMaterialsResponse.ExamResponse convertToExamResponse(Exam exam) {
        CourseMaterialsResponse.ExamResponse dto = new CourseMaterialsResponse.ExamResponse();
        dto.setId((long) exam.getExamId());
        dto.setTitle(exam.getTitle());
        dto.setDescription(exam.getDescription());
        dto.setExamDate(exam.getStartTime()); // Assuming you want startTime as examDate
        dto.setMarks(exam.getTotalMarks());
        return dto;
    }
}