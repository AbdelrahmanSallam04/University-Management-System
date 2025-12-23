package com.university.backend.service;

import com.university.backend.dto.*;
import com.university.backend.model.*;
import com.university.backend.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class ParentDashboardService {

    private final ParentRepository parentRepository;
    private final StudentRepository studentRepository;
    private final AssignmentSubmissionRepository assignmentSubmissionRepository;
    private final ExamSubmissionRepository examSubmissionRepository;

    // Remove CourseRepository dependency
    public ParentDashboardService(
            ParentRepository parentRepository,
            StudentRepository studentRepository,
            AssignmentSubmissionRepository assignmentSubmissionRepository,
            ExamSubmissionRepository examSubmissionRepository) {
        this.parentRepository = parentRepository;
        this.studentRepository = studentRepository;
        this.assignmentSubmissionRepository = assignmentSubmissionRepository;
        this.examSubmissionRepository = examSubmissionRepository;
    }

    /**
     * Retrieves all data required for the parent's dashboard view
     */
    public ParentDashboardDTO getParentDashboardData(Integer parentId) {
        // 1. Fetch Parent Entity
        Optional<Parent> parentOpt = parentRepository.findById(Long.valueOf(parentId));

        if (parentOpt.isEmpty()) {
            throw new RuntimeException("Parent with ID " + parentId + " not found.");
        }

        Parent parent = parentOpt.get();

        // 2. Fetch Children (students)
        List<Student> children = getChildrenByParent(parent);

        if (children.isEmpty()) {
            throw new RuntimeException("No children found for parent with ID " + parentId);
        }

        // 3. Map children to DTOs
        List<StudentDTO> childrenDTOs = children.stream()
                .map(this::mapToStudentDTO)
                .collect(Collectors.toList());

        // 4. Fetch data for all children
        List<AssignmentSubmissionDTO> pendingAssignments = getPendingAssignments(children);
        List<ExamSubmissionDTO> recentGrades = getRecentGrades(children);

        // 5. Calculate Statistics (simplified)
        DashboardStatsDTO stats = calculateDashboardStats(childrenDTOs, pendingAssignments);

        // 6. Map to DTO
        return mapToParentDashboardDTO(parent, childrenDTOs, pendingAssignments, recentGrades, stats);
    }

    /**
     * Get all children (students) for a parent
     */
    private List<Student> getChildrenByParent(Parent parent) {
        List<Student> children = new ArrayList<>();
        if (parent.getStudent() != null) {
            children.add(parent.getStudent());
        }
        return children;
    }

    /**
     * Map Student entity to StudentDTO (simplified)
     */
    private StudentDTO mapToStudentDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setStudentId(student.getUserId());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());

        if (student.getAccount() != null) {
            dto.setEmail(student.getAccount().getEmail());
        }

        // Get major and grade level


        // Calculate GPA from exams
        dto.setGpa(calculateGPAForStudent(student));

        // Get enrolled courses count (simplified - count from assignments/exams)
        dto.setEnrolledCoursesCount(getEnrolledCoursesCount(student));

        // Default attendance
        dto.setAttendancePercentage(95);

        return dto;
    }

    /**
     * Get pending assignments for a list of students
     */
    private List<AssignmentSubmissionDTO> getPendingAssignments(List<Student> students) {
        List<AssignmentSubmissionDTO> allPendingAssignments = new ArrayList<>();

        for (Student student : students) {
            // Get assignments for this student
            List<AssignmentSubmission> submissions = getAssignmentsForStudent(student.getUserId());

            // Filter for pending assignments
            List<AssignmentSubmissionDTO> pending = submissions.stream()
                    .filter(sub -> sub.getSubmitted_at() == null || sub.getGrade() == 0)
                    .map(this::mapToAssignmentSubmissionDTO)
                    .collect(Collectors.toList());

            allPendingAssignments.addAll(pending);
        }

        return allPendingAssignments;
    }

    /**
     * Get recent grades for a list of students
     */
    private List<ExamSubmissionDTO> getRecentGrades(List<Student> students) {
        List<ExamSubmissionDTO> allRecentGrades = new ArrayList<>();

        for (Student student : students) {
            // Get exam submissions for this student
            List<ExamSubmission> submissions = getExamsForStudent(student.getUserId());

            // Filter for completed exams with grades
            List<ExamSubmissionDTO> recentGrades = submissions.stream()
                    .filter(sub -> sub.getObtainedMarks() != null && sub.getObtainedMarks() > 0)
                    .sorted((a, b) -> b.getSubmittedAt().compareTo(a.getSubmittedAt()))
                    .limit(5)
                    .map(this::mapToExamSubmissionDTO)
                    .collect(Collectors.toList());

            allRecentGrades.addAll(recentGrades);
        }

        return allRecentGrades.stream()
                .sorted((a, b) -> b.getSubmittedAt().compareTo(a.getSubmittedAt()))
                .limit(10)
                .collect(Collectors.toList());
    }

    /**
     * Calculate dashboard statistics (simplified)
     */
    private DashboardStatsDTO calculateDashboardStats(
            List<StudentDTO> children,
            List<AssignmentSubmissionDTO> pendingAssignments) {

        DashboardStatsDTO stats = new DashboardStatsDTO();

        // Children count
        stats.setChildrenCount(children.size());

        // Average GPA
        double averageGPA = children.stream()
                .mapToDouble(StudentDTO::getGpa)
                .average()
                .orElse(0.0);
        stats.setAverageGPA(averageGPA);

        // Pending assignments count
        stats.setPendingAssignmentsCount(pendingAssignments.size());

        // Placeholder for other stats
        stats.setUnreadMessagesCount(0);
        stats.setUpcomingEventsCount(0);

        return stats;
    }

    /**
     * Map all data to ParentDashboardDTO
     */
    private ParentDashboardDTO mapToParentDashboardDTO(
            Parent parent,
            List<StudentDTO> children,
            List<AssignmentSubmissionDTO> pendingAssignments,
            List<ExamSubmissionDTO> recentGrades,
            DashboardStatsDTO stats) {

        ParentDashboardDTO dto = new ParentDashboardDTO();

        // Parent info
        dto.setUserId(parent.getUserId());
        dto.setFirstName(parent.getFirstName());
        dto.setLastName(parent.getLastName());

        if (parent.getAccount() != null) {
            dto.setEmail(parent.getAccount().getEmail());
        }

        // Children info
        dto.setChildren(children);

        // Pending assignments
        dto.setPendingAssignments(pendingAssignments);

        // Recent grades
        dto.setRecentGrades(recentGrades);

        // Statistics
        dto.setStats(stats);

        return dto;
    }

    /**
     * Map AssignmentSubmission to DTO
     */
    private AssignmentSubmissionDTO mapToAssignmentSubmissionDTO(AssignmentSubmission submission) {
        AssignmentSubmissionDTO dto = new AssignmentSubmissionDTO();
        dto.setAssignmentSubmissionId(submission.getAssignment_submission_id());



        if (submission.getSubmitted_at() != null) {
            dto.setSubmittedAt(submission.getSubmitted_at().toString());
        }

        dto.setAnswer(submission.getAnswer());
        dto.setGrade(submission.getGrade());
        dto.setFeedback(submission.getFeedback());

        // Add course info if available

        return dto;
    }

    /**
     * Map ExamSubmission to DTO
     */
    private ExamSubmissionDTO mapToExamSubmissionDTO(ExamSubmission submission) {
        ExamSubmissionDTO dto = new ExamSubmissionDTO();
        dto.setExamSubmissionId(submission.getExamSubmissionId());


        if (submission.getStudent() != null) {
            dto.setStudentId(submission.getStudent().getUserId());
            dto.setStudentName(submission.getStudent().getFirstName() + " " +
                    submission.getStudent().getLastName());
        }

        dto.setSubmittedAt(submission.getSubmittedAt());
        dto.setObtainedMarks(submission.getObtainedMarks());
        dto.setAnswers(submission.getAnswers());
        dto.setFeedback(submission.getFeedback());
        dto.setStatus(submission.getStatus());
        dto.setTimeTakenMinutes(submission.getTimeTakenMinutes());
        dto.setLate(false);

        return dto;
    }

    // Helper methods

    /**
     * Get assignments for a student
     */
    private List<AssignmentSubmission> getAssignmentsForStudent(Integer studentId) {
        try {
            // First try direct method
            return assignmentSubmissionRepository.findAll().stream()
                    .filter(sub -> sub.getStudent() != null &&
                            sub.getStudent().getUserId().equals(studentId))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    /**
     * Get exams for a student
     */
    private List<ExamSubmission> getExamsForStudent(Integer studentId) {
        try {
            return examSubmissionRepository.findAll().stream()
                    .filter(sub -> sub.getStudent() != null &&
                            sub.getStudent().getUserId().equals(studentId))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    /**
     * Calculate GPA for student
     */
    private Double calculateGPAForStudent(Student student) {
        try {
            List<ExamSubmission> examSubmissions = getExamsForStudent(student.getUserId());

            if (examSubmissions.isEmpty()) {
                return 0.0;
            }

            // Calculate average from completed exams
            double totalMarks = examSubmissions.stream()
                    .filter(exam -> exam.getObtainedMarks() != null && exam.getObtainedMarks() > 0)
                    .mapToInt(ExamSubmission::getObtainedMarks)
                    .sum();

            long gradedExams = examSubmissions.stream()
                    .filter(exam -> exam.getObtainedMarks() != null && exam.getObtainedMarks() > 0)
                    .count();

            if (gradedExams == 0) {
                return 0.0;
            }

            double averageMarks = totalMarks / gradedExams;

            // Convert to GPA (4.0 scale)
            if (averageMarks >= 90) return 4.0;
            if (averageMarks >= 80) return 3.0;
            if (averageMarks >= 70) return 2.0;
            if (averageMarks >= 60) return 1.0;
            return 0.0;
        } catch (Exception e) {
            return 0.0;
        }
    }

    /**
     * Get enrolled courses count for student
     */
    private Integer getEnrolledCoursesCount(Student student) {
        try {
            // Count unique courses from assignments and exams
            List<AssignmentSubmission> assignments = getAssignmentsForStudent(student.getUserId());
            List<ExamSubmission> exams = getExamsForStudent(student.getUserId());

            java.util.Set<Integer> courseIds = new java.util.HashSet<>();

            assignments.stream()
                    .filter(a -> a.getAssignment_id() != null &&
                            a.getAssignment_id().getCourse() != null)
                    .map(a -> a.getAssignment_id().getCourse().getCourseId())
                    .forEach(courseIds::add);

            exams.stream()
                    .filter(e -> e.getExam() != null && e.getExam().getCourse() != null)
                    .map(e -> e.getExam().getCourse().getCourseId())
                    .forEach(courseIds::add);

            return courseIds.size();
        } catch (Exception e) {
            return 0;
        }
    }

    // Additional service methods

    public List<StudentDTO> getChildren(Integer parentId) {
        Optional<Parent> parentOpt = parentRepository.findById(Long.valueOf(parentId));
        if (parentOpt.isEmpty()) {
            throw new RuntimeException("Parent not found");
        }

        List<Student> children = getChildrenByParent(parentOpt.get());
        return children.stream()
                .map(this::mapToStudentDTO)
                .collect(Collectors.toList());
    }

    public List<AssignmentSubmissionDTO> getChildAssignments(Integer studentId) {
        List<AssignmentSubmission> submissions = getAssignmentsForStudent(studentId);

        return submissions.stream()
                .map(this::mapToAssignmentSubmissionDTO)
                .collect(Collectors.toList());
    }

    public List<ExamSubmissionDTO> getChildGrades(Integer studentId) {
        List<ExamSubmission> submissions = getExamsForStudent(studentId);

        return submissions.stream()
                .filter(sub -> sub.getObtainedMarks() != null && sub.getObtainedMarks() > 0)
                .map(this::mapToExamSubmissionDTO)
                .collect(Collectors.toList());
    }
}