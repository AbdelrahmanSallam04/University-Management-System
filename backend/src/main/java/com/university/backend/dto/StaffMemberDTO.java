package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalTime;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class StaffMemberDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String departmentName;
    private String staffType; // "Professor" or "Teaching Assistant"
    private List<CourseInfoDTO> courses;
    private boolean hasOfficeHours;
}


