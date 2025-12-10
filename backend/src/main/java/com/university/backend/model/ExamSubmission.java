package com.university.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "exam_submission")
@Getter
@Setter
public class ExamSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exam_submission_id")
    private int examSubmissionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @Column(name = "obtained_marks")
    private Integer obtainedMarks;

    @Column(name = "answers", columnDefinition = "TEXT")
    private String answers;

    @Column(name = "submission_status")
    private String status = "NOT_ATTEMPTED";

    @Column(name = "time_taken_minutes")
    private Integer timeTakenMinutes;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;
}