package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class ExamDTO {
    private Integer examId;
    private Integer courseId;
    private String courseCode;
    private String courseName;
    private String title;
    private String description;
    private Integer totalMarks;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer durationMinutes;
    private String examType;
    private String status;
    private String timeRemaining;
    private boolean attempted;
    private Integer obtainedMarks;
    private String submissionStatus;
}

