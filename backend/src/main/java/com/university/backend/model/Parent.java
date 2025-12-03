package com.university.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "parents")
@Getter
@Setter
public class Parent extends User {

    @OneToOne
    @JoinColumn(name = "student_id")
    private Student student;
}
