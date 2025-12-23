package com.university.backend.repository;

import com.university.backend.model.ExamSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExamSubmissionRepository extends JpaRepository<ExamSubmission, Integer> {

    @Query("SELECT es FROM ExamSubmission es WHERE es.exam.examId = :examId AND es.student.userId = :studentId")
    Optional<ExamSubmission> findByExamIdAndStudentId(@Param("examId") Integer examId,
                                                      @Param("studentId") Integer studentId);

    @Query("SELECT CASE WHEN COUNT(es) > 0 THEN TRUE ELSE FALSE END " +
            "FROM ExamSubmission es WHERE es.exam.examId = :examId AND es.student.userId = :studentId")
    boolean existsByExamIdAndStudentId(@Param("examId") Integer examId,
                                       @Param("studentId") Integer studentId);

    @Query("SELECT es FROM ExamSubmission es " +
            "JOIN FETCH es.exam e " +
            "JOIN FETCH es.student s " +
            "WHERE es.exam.examId = :examId")
    List<ExamSubmission> findSubmissionsByExamId(@Param("examId") Integer examId);

    @Query("SELECT e FROM ExamSubmission e WHERE e.student.userId = :studentId")
    List<ExamSubmission> findByStudentUserId(@Param("studentId") Integer studentId);


    }
