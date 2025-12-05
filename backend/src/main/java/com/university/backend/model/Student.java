package com.university.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "students")
@Getter
@Setter
@PrimaryKeyJoinColumn(name = "user_id")
public class Student extends User {

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

}
