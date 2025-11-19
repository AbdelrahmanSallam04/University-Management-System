package com.university.backend.service;

import com.university.backend.dto.StudentDashboardDTO;
import com.university.backend.model.Student;
import com.university.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;


    /** Get student data for dashboard display */
    public StudentDashboardDTO getStudentDashboard(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        StudentDashboardDTO dashboard = new StudentDashboardDTO();
        dashboard.setFirstName(student.getFirstName());
        dashboard.setLastName(student.getLastName());
        dashboard.setEnrolledCoursesCount(student.getCourses() != null ? student.getCourses().size() : 0);

        return dashboard;
    }
}