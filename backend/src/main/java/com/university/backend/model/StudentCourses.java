package com.university.backend.model;

import jakarta.persistence.*;

@Entity
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
}

enum Status {
    Passed, Failed, Pending;
}
