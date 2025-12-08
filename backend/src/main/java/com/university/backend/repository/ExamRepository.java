package com.university.backend.repository;

import com.university.backend.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Integer> {
    List<Exam> findByCourseCourseId(int courseId);
}