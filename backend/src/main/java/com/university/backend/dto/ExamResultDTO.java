package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;

import lombok.Data; // Use @Data from Lombok for simplicity

@Data
@Setter
@Getter
public class ExamResultDTO {
    // Getters and Setters
    private int examResultId;
    private int examId;
    private int studentId;
    private String studentName;
    private Integer score;  // Changed to Integer to allow null
    private String feedback;

    // No-args constructor
    public ExamResultDTO() {}

    // All-args constructor
    public ExamResultDTO(int examResultId, int examId, int studentId,
                         String studentName, Integer score, String feedback) {
        this.examResultId = examResultId;
        this.examId = examId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.score = score;
        this.feedback = feedback;
    }

}