package com.university.backend.service;

import com.university.backend.dto.RegistrationRequestDTO;
import com.university.backend.dto.RegistrationResponseDTO;
import com.university.backend.model.*;
import com.university.backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RegistrationService {

    private final StudentCourseRepository studentCourseRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final RegistrationConfigRepository registrationConfigRepository;

    public RegistrationService(
            StudentCourseRepository studentCourseRepository,
            CourseRepository courseRepository,
            StudentRepository studentRepository,
            RegistrationConfigRepository registrationConfigRepository) {
        this.studentCourseRepository = studentCourseRepository;
        this.courseRepository = courseRepository;
        this.studentRepository = studentRepository;
        this.registrationConfigRepository = registrationConfigRepository;
    }

    @Transactional
    public RegistrationResponseDTO registerForCourse(Integer studentId, RegistrationRequestDTO request) {
        RegistrationResponseDTO response = new RegistrationResponseDTO();

        try {
            // 1. Get student and course
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            Course course = courseRepository.findById(request.getCourseId())
                    .orElseThrow(() -> new RuntimeException("Course not found"));

            // 2. Get registration config
            RegistrationConfig config = getRegistrationConfig();

            // 3. Check if already enrolled (using YOUR existing method)
            boolean alreadyEnrolled = studentCourseRepository
                    .existsByStudentUserIdAndCourseCourseId(studentId, request.getCourseId());

            if (alreadyEnrolled) {
                response.setSuccess(false);
                response.setMessage("You are already enrolled in this course");
                return response;
            }

            // 4. Check course capacity
            if (course.getCapacity() != null && course.getCurrentEnrollment() >= course.getCapacity()) {
                response.setSuccess(false);
                response.setMessage("Course is full. No available seats");
                return response;
            }

            // 5. Check credit hour limit
            int currentCredits = getStudentCurrentCredits(studentId, config.getCurrentTerm());

            if (currentCredits + course.getCreditHours() > config.getMaxCreditsPerStudent()) {
                response.setSuccess(false);
                response.setMessage(String.format(
                        "Credit limit exceeded. Current: %d credits, Course: %d credits, Max: %d credits",
                        currentCredits, course.getCreditHours(), config.getMaxCreditsPerStudent()
                ));
                return response;
            }

            // 6. Register student
            StudentCourses enrollment = new StudentCourses();
            enrollment.setStudent(student);
            enrollment.setCourse(course);
            //enrollment.setStatus(Status.Pending);
            enrollment.setMarks(0);
            enrollment.setRegistrationDate(LocalDateTime.now());
            enrollment.setTerm(config.getCurrentTerm());

            studentCourseRepository.save(enrollment);

            // 7. Update course enrollment count
            if (course.getCurrentEnrollment() == null) {
                course.setCurrentEnrollment(1);
            } else {
                course.setCurrentEnrollment(course.getCurrentEnrollment() + 1);
            }
            courseRepository.save(course);

            // 8. Return success
            response.setSuccess(true);
            response.setMessage("Successfully registered for " + course.getCode());
            response.setCourseId(course.getCourseId());
            response.setCourseCode(course.getCode());
            response.setCourseName(course.getName());
            response.setCurrentCredits(currentCredits + course.getCreditHours());
            response.setMaxCredits(config.getMaxCreditsPerStudent());

        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("Registration failed: " + e.getMessage());
        }

        return response;
    }

    @Transactional
    public RegistrationResponseDTO dropCourse(Integer studentId, RegistrationRequestDTO request) {
        RegistrationResponseDTO response = new RegistrationResponseDTO();

        try {
            // Find enrollment using YOUR repository method
            Optional<StudentCourses> enrollment = studentCourseRepository
                    .findByStudentUserIdAndCourseCourseId(studentId, request.getCourseId());

            if (enrollment.isEmpty()) {
                response.setSuccess(false);
                response.setMessage("You are not enrolled in this course");
                return response;
            }

            StudentCourses studentCourse = enrollment.get();
            Course course = studentCourse.getCourse();

            // Delete enrollment
            studentCourseRepository.delete(studentCourse);

            // Update course enrollment count
            if (course.getCurrentEnrollment() != null && course.getCurrentEnrollment() > 0) {
                course.setCurrentEnrollment(course.getCurrentEnrollment() - 1);
                courseRepository.save(course);
            }

            // Get updated credits
            RegistrationConfig config = getRegistrationConfig();
            int remainingCredits = getStudentCurrentCredits(studentId, config.getCurrentTerm());

            response.setSuccess(true);
            response.setMessage("Successfully dropped " + course.getCode());
            response.setCourseId(course.getCourseId());
            response.setCourseCode(course.getCode());
            response.setCourseName(course.getName());
            response.setCurrentCredits(remainingCredits);
            response.setMaxCredits(config.getMaxCreditsPerStudent());

        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("Failed to drop course: " + e.getMessage());
        }

        return response;
    }

    // Helper method - gets student's current credits
    private int getStudentCurrentCredits(Integer studentId, String term) {
        // Use YOUR existing repository method
        List<Course> enrolledCourses = studentCourseRepository.findCoursesById(studentId);

        // Filter by current term
        return enrolledCourses.stream()
                .filter(course -> {
                    // We need to check if each course is in current term
                    // For now, assume all enrolled courses are current term
                    return true;
                })
                .mapToInt(Course::getCreditHours)
                .sum();
    }

    // Get registration config
    private RegistrationConfig getRegistrationConfig() {
        return registrationConfigRepository.findFirstByOrderByIdDesc()
                .orElseGet(() -> {
                    RegistrationConfig defaultConfig = new RegistrationConfig();
                    return registrationConfigRepository.save(defaultConfig);
                });
    }

    // Get registration status
    public RegistrationStatusDTO getRegistrationStatus(Integer studentId) {
        RegistrationConfig config = getRegistrationConfig();

        List<Course> enrolledCourses = studentCourseRepository.findCoursesById(studentId);
        int totalCredits = enrolledCourses.stream()
                .mapToInt(Course::getCreditHours)
                .sum();

        RegistrationStatusDTO status = new RegistrationStatusDTO();
        status.setEnrolledCourses(enrolledCourses.size());
        status.setTotalCredits(totalCredits);
        status.setMaxCredits(config.getMaxCreditsPerStudent());
        status.setTerm(config.getCurrentTerm());
        status.setRegistrationOpen(config.getIsRegistrationOpen());

        return status;
    }

    // Inner DTO for status
    @Getter
    @Setter
    public static class RegistrationStatusDTO {
        private int enrolledCourses;
        private int totalCredits;
        private int maxCredits;
        private String term;
        private boolean registrationOpen;
    }
}