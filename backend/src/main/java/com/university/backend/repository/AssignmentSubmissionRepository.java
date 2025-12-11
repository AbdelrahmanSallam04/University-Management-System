package com.university.backend.repository;

import com.university.backend.model.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Integer> {

    @Query("SELECT a FROM AssignmentSubmission a WHERE a.assignment_id.assignmentId = :assignmentId")
    List<AssignmentSubmission> findByAssignmentId(@Param("assignmentId") int assignmentId);

    @Query("SELECT a FROM AssignmentSubmission a " +
            "LEFT JOIN FETCH a.student s " +
            "WHERE a.assignment_id.assignmentId = :assignmentId")
    List<AssignmentSubmission> findSubmissionsWithStudent(@Param("assignmentId") int assignmentId);
}