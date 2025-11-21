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

    // Getters and Setters

//    public Integer getUserId() {
//        return userId;
//    }
//
//    public void setUserId(Integer userId) {
//        this.userId = userId;
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
//
//    public Double getSalary() {
//        return salary;
//    }
//
//    public void setSalary(Double salary) {
//        this.salary = salary;
//    }
//
//    public String getDepartmentName() {
//        return departmentName;
//    }
//
//    public void setDepartmentName(String departmentName) {
//        this.departmentName = departmentName;
//    }
//
//    public List<Course_by_ProfessorDTO> getTaughtCourses() {
//        return taughtCourses;
//    }
//
//    public void setTaughtCourses(List<Course_by_ProfessorDTO> taughtCourses) {
//        this.taughtCourses = taughtCourses;
//    }
//
//    public List<Advised_By_ProfessorDTO> getAdviseeStudents() {
//        return adviseeStudents;
//    }
//
//    public void setAdviseeStudents(List<Advised_By_ProfessorDTO> adviseeStudents) {
//        this.adviseeStudents = adviseeStudents;
//    }
}