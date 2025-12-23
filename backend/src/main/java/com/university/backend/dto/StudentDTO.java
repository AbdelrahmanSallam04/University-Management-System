package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentDTO {
    private Integer studentId;
    private String firstName;
    private String lastName;
    private String email;
    private String gradeLevel;
    private String major;
    private Double gpa;
    private Integer attendancePercentage;
    private Integer enrolledCoursesCount;
}
