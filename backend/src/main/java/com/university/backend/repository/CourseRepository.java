package com.university.backend.repository;

import com.university.backend.model.Course;
import com.university.backend.model.Professor;
import com.university.backend.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> { // Changed to Integer

    @Query("SELECT c FROM Course c " +
            "LEFT JOIN FETCH c.courseType " +
            "LEFT JOIN FETCH c.department " +
            "LEFT JOIN FETCH c.professor")
    List<Course> findAllWithRelationships();

    @Query("SELECT c FROM Course c " +
            "LEFT JOIN FETCH c.courseType " +
            "LEFT JOIN FETCH c.department " +
            "LEFT JOIN FETCH c.professor " +
            "WHERE c.courseId = :courseId")
    Optional<Course> findByIdWithRelationships(@Param("courseId") Integer courseId); // Changed to Integer
    List<Course> findByProfessor(Professor professor);
}