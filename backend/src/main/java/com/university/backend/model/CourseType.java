package com.university.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "course_type")
@Getter
@Setter
public class CourseType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String type;

    // FIX: Add @JsonIgnore here to break the serialization loop.
    // When a CourseType is returned, it will NOT include the list of Courses.
    @OneToMany(mappedBy = "courseType")

    private List<Course> courses;
}