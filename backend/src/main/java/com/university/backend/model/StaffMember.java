package com.university.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "staff_members")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
public abstract class StaffMember extends User {

    @Column(nullable = false)
    private Double salary;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
}
