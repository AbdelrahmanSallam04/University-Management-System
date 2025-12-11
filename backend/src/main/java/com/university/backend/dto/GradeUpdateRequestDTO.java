package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;

import lombok.Data; // Use @Data from Lombok for simplicity

@Data
@Setter
@Getter
public class GradeUpdateRequestDTO {
    // Getters and Setters
    private Integer grade;  // For assignments
    private Integer score;  // For exams
    private String feedback;

    // No-args constructor
    public GradeUpdateRequestDTO() {}

    // Constructor for assignment grading
    public GradeUpdateRequestDTO(Integer grade, String feedback) {
        this.grade = grade;
        this.feedback = feedback;
    }

    // Constructor for exam grading
    public GradeUpdateRequestDTO(Integer score, String feedback, boolean isExam) {
        this.score = score;
        this.feedback = feedback;
    }

}