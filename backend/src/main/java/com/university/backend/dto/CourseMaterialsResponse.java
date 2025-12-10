package com.university.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CourseMaterialsResponse {
    private List<ExamResponse> exams;
    private List<AssignmentResponse> assignments;

    @Data
    public static class ExamResponse {
        private Long id;              // Crucial for clicking/editing
        private String title;
        private String description;
        private LocalDateTime examDate;
        private Integer marks;
    }

    @Data
    public static class AssignmentResponse {
        private Long id;              // Crucial for clicking/editing
        private String title;
        private String description;
        private LocalDateTime dueDate;
        private Integer marks;
    }
}