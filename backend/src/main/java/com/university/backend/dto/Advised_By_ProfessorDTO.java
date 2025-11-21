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

    // Getters and Setters

//    public Integer getStudentId() {
//        return studentId;
//    }
//
//    public void setStudentId(Integer studentId) {
//        this.studentId = studentId;
//    }
//
//    public String getFirstName() {
//        return firstName;
//    }
//
//    public void setFirstName(String firstName) {
//        this.firstName = firstName;
//    }
//
//    public String getLastName() {
//        return lastName;
//    }
//
//    public void setLastName(String lastName) {
//        this.lastName = lastName;
//    }
//
//    public String getEmail() {
//        return email;
//    }
//
//    public void setEmail(String email) {
//        this.email = email;
//    }
}