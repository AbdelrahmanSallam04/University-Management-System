package com.university.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @ManyToOne
    @JoinColumn(name = "department_head_id")
    private Professor departmentHead;
    //prof
    @OneToMany(mappedBy = "department")
    @JsonIgnore
    private List<Course> courses;
}