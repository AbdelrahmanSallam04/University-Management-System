package com.university.backend.repository;

import com.university.backend.model.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, Integer> {

    @Query("SELECT e FROM ExamResult e WHERE e.exam_id.examId = :examId")
    List<ExamResult> findByExamId(@Param("examId") int examId);

    @Query("SELECT e FROM ExamResult e " +
            "LEFT JOIN FETCH e.student_id s " +
            "WHERE e.exam_id.examId = :examId")
    List<ExamResult> findResultsWithStudent(@Param("examId") int examId);
}