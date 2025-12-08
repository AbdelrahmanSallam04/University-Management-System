package com.university.backend.dto;

import java.time.LocalDateTime;

public class PublishExamRequest {
    private String title;
    private String description;
    private LocalDateTime examDate; // Use this field name for the Exam entity
    private Integer marks;

    // Default constructor, getters, and setters (omitted for brevity, assume Lombok or manual creation)


}