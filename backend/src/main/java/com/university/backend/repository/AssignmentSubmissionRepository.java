package com.university.backend.repository;

import com.university.backend.model.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Integer> {

    // Find submission by assignment and student
    @Query("SELECT s FROM AssignmentSubmission s WHERE s.assignment_id.assignmentId = :assignmentId AND s.student.userId = :studentId")
    Optional<AssignmentSubmission> findByAssignmentIdAndStudentId(
            @Param("assignmentId") Integer assignmentId,
            @Param("studentId") Integer studentId);

    // Check if student has submitted an assignment
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN TRUE ELSE FALSE END FROM AssignmentSubmission s WHERE s.assignment_id.assignmentId = :assignmentId AND s.student.userId = :studentId")
    boolean existsByAssignmentIdAndStudentId(@Param("assignmentId") Integer assignmentId,
                                             @Param("studentId") Integer studentId);

    // Find all submissions for a student
    @Query("SELECT s FROM AssignmentSubmission s WHERE s.student.userId = :studentId")
    List<AssignmentSubmission> findByStudentId(@Param("studentId") Integer studentId);

    // Find submissions for a specific assignment
    @Query("SELECT s FROM AssignmentSubmission s WHERE s.assignment_id.assignmentId = :assignmentId")
    List<AssignmentSubmission> findByAssignmentId(@Param("assignmentId") Integer assignmentId);
}