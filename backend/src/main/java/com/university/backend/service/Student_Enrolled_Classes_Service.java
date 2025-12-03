// src/main/java/com/university/backend/service/StudentService.java

package com.university.backend.service;

import com.university.backend.model.Student;
import com.university.backend.model.Course;
import com.university.backend.model.StudentCourses;
import com.university.backend.repository.StudentCourseRepository;
import com.university.backend.repository.StudentRepository; // <-- Import the new repository
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.NoSuchElementException;

@Service
public class Student_Enrolled_Classes_Service {

    private final StudentRepository studentRepository;
    private final StudentCourseRepository studentCourseRepository;

    // Use constructor injection for the repository
    public Student_Enrolled_Classes_Service(StudentRepository studentRepository, StudentCourseRepository studentCourseRepository) {
        this.studentRepository = studentRepository;
        this.studentCourseRepository = studentCourseRepository;
    }

    /**
     * Retrieves the set of courses a specific student is currently enrolled in.
     * @param studentId The ID of the authenticated student.
     * @return A Set of Course objects.
     */
    public List<Course> getEnrolledCourses(Integer studentId) {

        // 1. Fetch the Student entity using the injected repository
//        Student students = studentRepository.findById(studentId)
//                // Handle the case where the student ID might be invalid or not found
//                .orElseThrow(() -> new NoSuchElementException("Student not found with ID: " + studentId));

        List<Course> courses = studentCourseRepository.findCoursesById(studentId);
                // Handle the case where the student ID might be invalid or not found

        // 2. Return the courses Set. 
        // Thanks to the @ManyToMany mapping in your Student entity, JPA fetches 
        // the linked courses automatically (potentially lazily).
        return courses;
    }
}