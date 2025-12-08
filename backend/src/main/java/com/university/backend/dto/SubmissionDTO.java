package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SubmissionDTO {
    private Integer submissionId;
    private String submissionText;
    private LocalDateTime submittedAt;
    private Integer marksObtained;
    private String feedback;
    private String status; // "SUBMITTED", "LATE", "GRADED"
    private boolean isLate;
}
