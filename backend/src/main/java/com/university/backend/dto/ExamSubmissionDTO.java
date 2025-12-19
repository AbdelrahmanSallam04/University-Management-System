package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ExamSubmissionDTO {
    private Integer examSubmissionId;
    private Integer examId;           // ✅ Add this
    private Integer studentId;        // ✅ Add this
    private String studentName;
    private String answers;
    private LocalDateTime submittedAt;
    private Integer obtainedMarks;
    private String feedback;
    private String status;
    private Integer timeTakenMinutes;
    private boolean isLate;
}
