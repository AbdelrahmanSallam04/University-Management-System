package com.university.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class TADashboardDTO {
    private Integer userId;
    private Integer staffMemberId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String departmentName;
    private Integer assignedCourses;
    private Integer officeHours;
    private Double salary;
    private String accountType;
}