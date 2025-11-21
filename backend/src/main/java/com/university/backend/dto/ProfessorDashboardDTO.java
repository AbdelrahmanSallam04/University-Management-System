package com.university.backend.dto;

import java.util.List;

/**
 * Main DTO for the Professor Dashboard view.
 * Aggregates professor's profile, courses, advisees, and department info.
 */
import lombok.Data; // Use @Data from Lombok for simplicity

@Data
public class ProfessorDashboardDTO {

    // userId uses Integer to match the User primary key
    private Integer userId;
    private String firstName;
    private String lastName;
    private String email;
    private Double salary;

    // Department Info
    private String departmentName;

    // Relationship Info
    private List<Course_by_ProfessorDTO> taughtCourses;
    private List<Advised_By_ProfessorDTO> adviseeStudents;


}