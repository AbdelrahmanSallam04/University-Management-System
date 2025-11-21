package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class StudentDashboardDTO {
    private String firstName;
    private String lastName;
    private int enrolledCoursesCount;
    private double gpa;
    private String major;

}