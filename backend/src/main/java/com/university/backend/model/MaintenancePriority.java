package com.university.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_priorities")
@Getter
@Setter
public class MaintenancePriority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String level; // e.g., LOW, MEDIUM, HIGH
}
