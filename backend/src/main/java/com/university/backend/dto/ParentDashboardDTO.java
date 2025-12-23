package com.university.backend.dto;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class ParentDashboardDTO {
    private Integer userId;
    private String firstName;
    private String lastName;
    private String email;
    private List<StudentDTO> children;
    private List<AssignmentSubmissionDTO> pendingAssignments;
    private List<ExamSubmissionDTO> recentGrades;
    private DashboardStatsDTO stats;
}
