package com.university.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "tas")
@Getter
@Setter
public class TA extends StaffMember {
    @ManyToMany
    @JoinTable(
            name = "ta_assisting_courses",
            joinColumns = @JoinColumn(name = "ta_id"),
            inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private List<Course> assistingCourses;
}
