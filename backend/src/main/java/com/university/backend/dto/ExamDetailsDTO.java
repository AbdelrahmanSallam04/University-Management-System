package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ExamDetailsDTO {
    private Integer examId;
    private String title;
    private String description;
    private Integer totalMarks;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer durationMinutes;
    private String examType;
    private String courseCode;
    private String courseName;
    private String professorName;
    private ExamSubmissionDTO submission;
}
