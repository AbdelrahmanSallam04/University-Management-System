package com.university.backend.repository;

import com.university.backend.model.Course;
import com.university.backend.model.Professor;
import com.university.backend.model.Student;
import com.university.backend.model.StudentCourses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentCourseRepository extends JpaRepository<StudentCourses, Integer> {

    // FIXED: Query should select Course, not StudentCourses
    @Query("SELECT sc.course FROM StudentCourses sc WHERE sc.student.userId = :studentId")
    List<Course> findCoursesById(@Param("studentId") Integer studentId);

    // NEW methods needed for registration

    // Check if student is enrolled in a specific course
    @Query("SELECT CASE WHEN COUNT(sc) > 0 THEN TRUE ELSE FALSE END " +
            "FROM StudentCourses sc " +
            "WHERE sc.student.userId = :studentId AND sc.course.courseId = :courseId")
    boolean existsByStudentUserIdAndCourseCourseId(@Param("studentId") Integer studentId,
                                                   @Param("courseId") Integer courseId);

    // Find specific enrollment
    @Query("SELECT sc FROM StudentCourses sc " +
            "WHERE sc.student.userId = :studentId AND sc.course.courseId = :courseId")
    Optional<StudentCourses> findByStudentUserIdAndCourseCourseId(@Param("studentId") Integer studentId,
                                                                  @Param("courseId") Integer courseId);

}