// src/main/java/com/university/backend/service/MappingService.java

package com.university.backend.service;

import com.university.backend.dto.CourseDTO;
import com.university.backend.model.Course;
import org.springframework.stereotype.Service;

@Service
public class MappingService {

    public CourseDTO toCourseDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setCourseId(course.getCourseId());
        dto.setCode(course.getCode());
        dto.setName(course.getName());
        dto.setCreditHours(course.getCreditHours());

        // Mapping from the relationships:
        if (course.getCourseType() != null) {
            dto.setCourseTypeName(course.getCourseType().getType());
        }

        if (course.getProfessor() != null) {
            String fullName = course.getProfessor().getFirstName() + " " + course.getProfessor().getLastName();
            dto.setProfessorFullName(fullName);
            // Note: We completely ignore the Professor's Account/AccountType to break the loop and hide passwords.
        }

        return dto;
    }
}