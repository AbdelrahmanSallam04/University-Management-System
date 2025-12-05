package com.university.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "registration_config")
@Getter
@Setter
public class RegistrationConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "max_credits_per_student", nullable = false)
    private Integer maxCreditsPerStudent = 18;

    @Column(name = "is_registration_open", nullable = false)
    private Boolean isRegistrationOpen = true;

    @Column(name = "current_term", nullable = false)
    private String currentTerm = "Fall 2024";
}