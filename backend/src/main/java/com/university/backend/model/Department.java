package com.university.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "department")
@Getter
@Setter
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer departmentId;

    @Column(name = "department_name")
    private String name;

    @Column(name = "department_code")
    private String code;

    @ManyToOne
    @JoinColumn(name = "department_head_id")
    private Professor departmentHead;
//prof
    @OneToMany(mappedBy = "department")
    private List<Course> courses;
}
