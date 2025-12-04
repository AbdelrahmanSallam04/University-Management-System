package com.university.backend.service;

import com.university.backend.dto.StudentDashboardDTO;
import com.university.backend.model.Course;
import com.university.backend.model.Student;
import com.university.backend.repository.StudentCourseRepository;
import com.university.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentDashboardService {

    private final StudentRepository studentRepository;
    private final StudentCourseRepository studentCourseRepository;


    /** Get student data for dashboard display */
    public StudentDashboardDTO getStudentDashboard(Integer userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Course> courses = studentCourseRepository.findCoursesById(userId);

        StudentDashboardDTO dashboard = new StudentDashboardDTO();
        dashboard.setFirstName(student.getFirstName());
        dashboard.setLastName(student.getLastName());
        dashboard.setEnrolledCoursesCount(courses != null ? courses.size() : 0);

        return dashboard;
    }
}