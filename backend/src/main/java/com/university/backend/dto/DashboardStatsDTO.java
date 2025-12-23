package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DashboardStatsDTO {
    private Integer childrenCount;
    private Double averageGPA;
    private Integer pendingAssignmentsCount;
    private Integer unreadMessagesCount;
    private Integer upcomingEventsCount;
}

