package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseCatalogDTO {
    private Integer courseId;
    private String code;
    private String name;
    private String description;
    private Integer creditHours;
    private String courseType;
    private String departmentName;
    private String professorName;
    private String professorFirstName;
    private String professorLastName;
    private boolean enrolled; // Add this field
}