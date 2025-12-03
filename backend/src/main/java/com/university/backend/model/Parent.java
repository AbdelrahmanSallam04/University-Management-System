package com.university.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "parents")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
public abstract class Parent extends User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "parent_id")
    private Integer id;

    @OneToOne
    @JoinColumn(name = "student_id")
    private Student student;
}
