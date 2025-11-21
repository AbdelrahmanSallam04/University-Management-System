package com.university.backend.dto;

/**
 * DTO for a simplified view of a Course, used in Professor Dashboard.
 */
import lombok.Data; // Use @Data from Lombok for simplicity

@Data
public class Course_by_ProfessorDTO {

    private Integer courseId;
    private String code;
    private String name;
    private Integer creditHours;


}