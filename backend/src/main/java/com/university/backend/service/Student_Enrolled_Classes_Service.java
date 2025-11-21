// src/main/java/com/university/backend/service/StudentService.java

package com.university.backend.service;

import com.university.backend.model.Student;
import com.university.backend.model.Course;
import com.university.backend.repository.StudentRepository; // <-- Import the new repository
import org.springframework.stereotype.Service;
import java.util.Set;
import java.util.NoSuchElementException;

@Service
public class Student_Enrolled_Classes_Service {

    private final StudentRepository studentRepository;

    // Use constructor injection for the repository
    public Student_Enrolled_Classes_Service(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    /**
     * Retrieves the set of courses a specific student is currently enrolled in.
     * @param studentId The ID of the authenticated student.
     * @return A Set of Course objects.
     */
    public Set<Course> getEnrolledCourses(Integer studentId) {

        // 1. Fetch the Student entity using the injected repository
        Student student = studentRepository.findById(Long.valueOf(studentId))
                // Handle the case where the student ID might be invalid or not found
                .orElseThrow(() -> new NoSuchElementException("Student not found with ID: " + studentId));

        // 2. Return the courses Set. 
        // Thanks to the @ManyToMany mapping in your Student entity, JPA fetches 
        // the linked courses automatically (potentially lazily).
        return student.getCourses();
    }
}