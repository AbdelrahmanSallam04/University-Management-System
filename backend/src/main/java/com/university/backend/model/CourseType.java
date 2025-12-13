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

    // ✅ FIXED: @JsonIgnore added to break the serialization loop
    @OneToMany(mappedBy = "courseType")
    @JsonIgnore  // This prevents the courses list from being included in JSON
    private List<Course> courses;
}