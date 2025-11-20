package ServicesTests;// src/test/java/com/university/backend/service/StudentServiceTest.java

import com.university.backend.model.Student;
import com.university.backend.model.Course;
import com.university.backend.repository.StudentRepository;
import com.university.backend.service.Student_Enrolled_Classes_Service;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.Set;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class Student_Enrolled_Classes_ServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private Student_Enrolled_Classes_Service studentService;

    // Test Case 1: Successfully retrieves courses
    @Test
    void getEnrolledCourses_Success() {
        // Arrange
        Integer studentId = 100;

        // Create a mock Student object
        Student mockStudent = new Student();

        // Create mock Course objects
        Course math = new Course();
        math.setCourseId(101);
        math.setName("Calculus I");

        Course cs = new Course();
        cs.setCourseId(102);
        cs.setName("Intro to CS");

        // Set the courses on the mock student
        mockStudent.setCourses(Set.of(math, cs));

        // Configure the repository mock to return the student
        when(studentRepository.findById(studentId)).thenReturn(Optional.of(mockStudent));

        // Act
        Set<Course> result = studentService.getEnrolledCourses(studentId);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.stream().anyMatch(c -> c.getName().equals("Calculus I")));
    }

    // Test Case 2: Student not found
    @Test
    void getEnrolledCourses_StudentNotFound() {
        // Arrange
        Integer studentId = 999;

        // Configure the repository mock to return an empty Optional
        when(studentRepository.findById(studentId)).thenReturn(Optional.empty());

        // Assert that calling the service throws the expected exception
        assertThrows(NoSuchElementException.class, () -> {
            studentService.getEnrolledCourses(studentId);
        });
    }
}