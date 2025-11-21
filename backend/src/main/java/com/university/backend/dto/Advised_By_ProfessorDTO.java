package com.university.backend.dto;

/**
 * DTO for a simplified view of a Student (Advisee), used in Professor Dashboard.
 */
import lombok.Data; // Use @Data from Lombok for simplicity

@Data
public class Advised_By_ProfessorDTO {

    // studentId uses Integer to match the User primary key
    private Integer studentId;
    private String firstName;
    private String lastName;
    private String email;


}