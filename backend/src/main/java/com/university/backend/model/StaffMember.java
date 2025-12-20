package com.university.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "staff_members")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
public abstract class StaffMember extends User {

    @Column(name = "salary", nullable = false)
    private Double salary;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    // Add office hours relationship
    @OneToMany(mappedBy = "staffMember")
    @JsonIgnore
    private List<OfficeHours> officeHours;
}
