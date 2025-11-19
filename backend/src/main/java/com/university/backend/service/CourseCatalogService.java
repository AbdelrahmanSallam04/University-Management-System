package com.university.backend.service;

import com.university.backend.dto.CourseCatalogDTO;
import com.university.backend.model.Course;
import com.university.backend.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseCatalogService {

    private final CourseRepository courseRepository;

    public List<CourseCatalogDTO> getAllCourses() {
        List<Course> courses = courseRepository.findAllWithRelationships();
        return courses.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CourseCatalogDTO getCourseById(Integer courseId) { // Changed to Integer
        Course course = courseRepository.findByIdWithRelationships(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        return convertToDTO(course);
    }
    public List<String> getCourseTypes() {
        return courseRepository.findAll().stream()
                .map(course -> course.getCourseType().getType())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public List<String> getDepartments() {
        return courseRepository.findAll().stream()
                .map(course -> course.getDepartment().getName())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    private CourseCatalogDTO convertToDTO(Course course) {
        CourseCatalogDTO dto = new CourseCatalogDTO();
        dto.setCourseId(course.getCourseId());
        dto.setCode(course.getCode());
        dto.setName(course.getName());
        dto.setDescription(course.getDescription());
        dto.setCreditHours(course.getCreditHours());

        // Handle CourseType relationship - using getType() instead of getName()
        if (course.getCourseType() != null) {
            dto.setCourseType(course.getCourseType().getType()); // Changed to getType()
        } else {
            dto.setCourseType("Not specified");
        }

        // Handle Department relationship
        if (course.getDepartment() != null) {
            dto.setDepartmentName(course.getDepartment().getName());
        } else {
            dto.setDepartmentName("Not specified");
        }

        // Handle Professor relationship (nullable = true)
        if (course.getProfessor() != null) {
            dto.setProfessorName(course.getProfessor().getFirstName() + " " + course.getProfessor().getLastName());
            dto.setProfessorFirstName(course.getProfessor().getFirstName());
            dto.setProfessorLastName(course.getProfessor().getLastName());
        } else {
            dto.setProfessorName("Not assigned");
            dto.setProfessorFirstName("Not");
            dto.setProfessorLastName("Assigned");
        }

        return dto;
    }
}