package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmitAssignmentDTO {
    private Integer assignmentId;
    private String submissionText;
}
