package com.university.backend.repository;

import com.university.backend.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Integer> {

    // Find assignments by course ID
    @Query("SELECT a FROM Assignment a WHERE a.course.courseId = :courseId")
    List<Assignment> findByCourseId(@Param("courseId") Integer courseId);

    // Find assignments by multiple course IDs
    @Query("SELECT a FROM Assignment a WHERE a.course.courseId IN :courseIds")
    List<Assignment> findByCourseIdIn(@Param("courseIds") List<Integer> courseIds);

    // Find assignments due after a specific date
    @Query("SELECT a FROM Assignment a WHERE a.course.courseId = :courseId AND a.dueDate > :date")
    List<Assignment> findByCourseIdAndDueAfter(@Param("courseId") Integer courseId,
                                               @Param("date") LocalDateTime date);
}