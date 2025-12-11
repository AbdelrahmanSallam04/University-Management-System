package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;

import lombok.Data; // Use @Data from Lombok for simplicity

@Data
@Setter
@Getter
public class AssignmentSubmissionDTO {
    // Getters and Setters
    private int assignmentSubmissionId;
    private int assignmentId;
    private int studentId;

    private String submittedAt;
    private String answer;
    private Integer grade;  // Changed to Integer to allow null
    private String feedback;

    // No-args constructor (required for JSON deserialization)
    public AssignmentSubmissionDTO() {}

    // All-args constructor
    public AssignmentSubmissionDTO(int assignmentSubmissionId, int assignmentId,
                                   int studentId,  String submittedAt,
                                   String answer, Integer grade, String feedback) {
        this.assignmentSubmissionId = assignmentSubmissionId;
        this.assignmentId = assignmentId;
        this.studentId = studentId;
        this.submittedAt = submittedAt;
        this.answer = answer;
        this.grade = grade;
        this.feedback = feedback;
    }

}