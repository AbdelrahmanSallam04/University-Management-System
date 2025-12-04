package com.university.backend.repository;

import com.university.backend.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface StudentCourseRepository extends JpaRepository<Course, Integer> {

    // FIXED: Query should select Course, not StudentCourses
    @Query("SELECT c FROM Course c " +
            "JOIN StudentCourses sc ON c.courseId = sc.course.courseId " +
            "WHERE sc.student.userId = :studentId")
    List<Course> findCoursesById(@Param("studentId") Integer studentId);
}


