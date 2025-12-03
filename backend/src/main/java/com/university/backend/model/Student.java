package com.university.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Entity
@Table(name = "students")
@Getter
@Setter
@PrimaryKeyJoinColumn(name = "user_id")
public class Student extends User {

    @ManyToMany
    @JoinTable(
            name = "student_courses",
            joinColumns = @JoinColumn(name = "student_id"),//LEHHHHHHHHHHHHHHHHHH
            inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> courses;

}
