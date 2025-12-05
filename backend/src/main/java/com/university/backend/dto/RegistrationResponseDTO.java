package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegistrationResponseDTO {
    private boolean success;
    private String message;
    private Integer courseId;
    private String courseCode;
    private String courseName;
    private Integer currentCredits;
    private Integer maxCredits;
}