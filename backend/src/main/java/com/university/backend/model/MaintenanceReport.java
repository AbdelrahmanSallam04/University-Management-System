package com.university.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_reports")
@Getter
@Setter
public class MaintenanceReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @ManyToOne
    @JoinColumn(name = "admin_id") // Nullable until an admin takes action
    private User admin;

    @ManyToOne
    @JoinColumn(name = "status_id", nullable = false)
    private MaintenanceStatus status;

    @ManyToOne
    @JoinColumn(name = "priority_id", nullable = false)
    private MaintenancePriority priority;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime createdAt = LocalDateTime.now();
}