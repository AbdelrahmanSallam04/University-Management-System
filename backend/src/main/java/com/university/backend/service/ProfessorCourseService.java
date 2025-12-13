package com.university.backend.service;

import com.university.backend.dto.CourseMaterialsResponse;
import com.university.backend.model.Assignment;
import com.university.backend.model.Course;
import com.university.backend.model.Exam;
import com.university.backend.repository.AssignmentRepository;
import com.university.backend.repository.CourseRepository;
import com.university.backend.repository.ExamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessorCourseService {

    private final AssignmentRepository assignmentRepository;
    private final ExamRepository examRepository;
    private final CourseRepository courseRepository;

    // Constructor Injection
    public ProfessorCourseService(AssignmentRepository assignmentRepository,
                                  ExamRepository examRepository,
                                  CourseRepository courseRepository) {
        this.assignmentRepository = assignmentRepository;
        this.examRepository = examRepository;
        this.courseRepository = courseRepository;
    }

    /**
     * Publishes a new Assignment for a specific course.
     * Verifies that the requesting professor is the instructor of the course.
     */
    @Transactional
    public Assignment publishAssignment(Integer professorId, Integer courseId, Assignment assignmentDetails) {
        // 1. Fetch the Course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));

        // 2. Validate: Is this professor teaching this course?
        // Note: We assume the 'User' parent class provides a getId() method.
        if (course.getProfessor() == null || !course.getProfessor().getUserId().equals(professorId)) {
            throw new RuntimeException("Unauthorized: Professor " + professorId + " is not assigned to teach this course.");
        }

        // 3. Set relationships and defaults
        // Note: Using 'setCourse_id' because your entity field is named 'course_id'
        assignmentDetails.setCourse(course);
        assignmentDetails.setCreatedAt(LocalDateTime.now());

        // 4. Save to Database
        return assignmentRepository.save(assignmentDetails);
    }

    /**
     * Publishes a new Exam for a specific course.
     * Verifies that the requesting professor is the instructor of the course.
     */
    @Transactional
    public Exam publishExam(Integer professorId, Integer courseId, Exam examDetails) {
        // 1. Fetch the Course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));

        // 2. Validate: Is this professor teaching this course?
        if (course.getProfessor() == null || !course.getProfessor().getUserId().equals(professorId)) {
            throw new RuntimeException("Unauthorized: Professor " + professorId + " is not assigned to teach this course.");
        }

        // 3. Set relationships
        // Note: Using 'setCourse_id' because your entity field is named 'course_id'
        examDetails.setCourse(course);

        // 4. Save to Database
        return examRepository.save(examDetails);
    }


    public CourseMaterialsResponse getCourseMaterials(Long courseId) {
        // Convert Long to int if your DB uses int
        int cId = courseId.intValue();

        // 1. Fetch
        List<Exam> exams = examRepository.findByCourseCourseId(cId);
        List<Assignment> assignments = assignmentRepository.findByCourseId(cId);

        // 2. Map Exams
        List<CourseMaterialsResponse.ExamResponse> examDTOs = exams.stream().map(exam -> {
            CourseMaterialsResponse.ExamResponse dto = new CourseMaterialsResponse.ExamResponse();
            // FIX: Using getExamId() (assuming Exam entity follows Assignment pattern)
            dto.setId((long) exam.getExamId());
            dto.setTitle(exam.getTitle());
            dto.setDescription(exam.getDescription());
            dto.setExamDate(exam.getStartTime());
            dto.setMarks(exam.getTotalMarks());
            return dto;
        }).collect(Collectors.toList());

        // 3. Map Assignments
        List<CourseMaterialsResponse.AssignmentResponse> assignmentDTOs = assignments.stream().map(assign -> {
            CourseMaterialsResponse.AssignmentResponse dto = new CourseMaterialsResponse.AssignmentResponse();
            // FIX: Using getAssignmentId() instead of getId()
            dto.setId((long) assign.getAssignmentId());
            dto.setTitle(assign.getTitle());
            dto.setDescription(assign.getDescription());
            dto.setDueDate(assign.getDueDate());
            dto.setMarks(assign.getMarks());
            return dto;
        }).collect(Collectors.toList());

        CourseMaterialsResponse response = new CourseMaterialsResponse();
        response.setExams(examDTOs);
        response.setAssignments(assignmentDTOs);

        return response;
    }
}