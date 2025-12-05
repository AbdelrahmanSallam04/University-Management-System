package com.university.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "student_courses")
public class StudentCourses {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_course_id")
    private Integer studentCourseId;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "marks")
    private int marks;

    @Column(name = "status")
    private Status status;

    // Add these fields to your existing StudentCourses.java
    @Column(name = "registration_date")
    private LocalDateTime registrationDate;

    @Column(name = "term")
    private String term = "Fall 2024"; // Default value
}

enum Status {
    Passed, Failed, Pending;
}
