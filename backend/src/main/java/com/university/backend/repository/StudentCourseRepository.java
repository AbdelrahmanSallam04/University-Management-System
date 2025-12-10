package com.university.backend.repository;

import com.university.backend.model.Course;
import com.university.backend.model.Professor;
import com.university.backend.model.Student;
import com.university.backend.model.StudentCourses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentCourseRepository extends JpaRepository<StudentCourses, Integer> {

    @Query("SELECT sc.course FROM StudentCourses sc WHERE sc.student.userId = :studentId")
    List<Course> findCoursesById(@Param("studentId") int studentId);

}