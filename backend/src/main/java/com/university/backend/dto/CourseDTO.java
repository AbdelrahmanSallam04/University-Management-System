// src/main/java/com/university/backend/dto/CourseDTO.java

package com.university.backend.dto;

import lombok.Data; // Use @Data from Lombok for simplicity

@Data
public class CourseDTO {
    private Integer courseId;
    private String code;
    private String name;
    private Integer creditHours;

    // Flattened fields from the relationships:
    private String courseTypeName;
    private String professorFullName; // We will map the first/last name here
}