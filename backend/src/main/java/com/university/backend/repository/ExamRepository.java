package com.university.backend.repository;

import com.university.backend.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Integer> {

    @Query("SELECT e FROM Exam e WHERE e.course.courseId = :courseId AND e.isActive = true")
    List<Exam> findByCourseId(@Param("courseId") Integer courseId);

    @Query("SELECT e FROM Exam e WHERE e.course.courseId IN :courseIds AND e.isActive = true")
    List<Exam> findByCourseIdIn(@Param("courseIds") List<Integer> courseIds);
}