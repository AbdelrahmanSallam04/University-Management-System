//package com.university.backend.model;
//
//import jakarta.persistence.*;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "assignment_submission")
//public class AssignmentSubmission {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "assignment_submission_id")
//    private int assignment_submission_id;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "assignment_id", nullable = false)
//    private Assignment assignment_id;
//
//    @Column(name = "student_id", nullable = false, length = 255)
//    private Student student_id;
//
//    @Column(name = "submitted_at", nullable = false)
//    private LocalDateTime submitted_at;
//
//    @Column(name = "answer", columnDefinition = "TEXT")
//    private String answer;
//
//    @Column(name = "grade")
//    private int grade;
//
//    @Column(name = "feedback", columnDefinition = "TEXT")
//    private String feedback;
//}
