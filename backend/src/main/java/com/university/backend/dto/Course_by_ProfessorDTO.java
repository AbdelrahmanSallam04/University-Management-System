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

    // Getters and Setters

//    public Integer getCourseId() {
//        return courseId;
//    }
//
//    public void setCourseId(Integer courseId) {
//        this.courseId = courseId;
//    }
//
//    public String getCode() {
//        return code;
//    }
//
//    public void setCode(String code) {
//        this.code = code;
//    }
//
//    public String getName() {
//        return name;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }
//
//    public Integer getCreditHours() {
//        return creditHours;
//    }
//
//    public void setCreditHours(Integer creditHours) {
//        this.creditHours = creditHours;
//    }
}