package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AssignmentDetailsDTO {
    private Integer assignmentId;
    private Integer courseId;
    private String courseCode;
    private String courseName;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private Integer totalMarks;
    private String professorName;
    private SubmissionDTO submission; // Current submission if exists
}
