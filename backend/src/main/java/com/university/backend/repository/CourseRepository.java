package com.university.backend.repository;

import com.university.backend.model.Course;
import com.university.backend.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {

    /**
     * Finds all courses assigned to a specific professor.
     */
    List<Course> findByProfessor(Professor professor);
}