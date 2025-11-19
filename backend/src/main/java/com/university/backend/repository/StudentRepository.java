// com/university/backend/repository/StudentRepository.java

package com.university.backend.repository;

import com.university.backend.model.Student; // Import your entity
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface that extends JpaRepository to provide automatic CRUD operations 
 * for the Student entity.
 */
@Repository // Optional but good practice
public interface StudentRepository extends JpaRepository<Student, Integer> {

    // JpaRepository takes two generics:
    // 1. The Entity Class: Student
    // 2. The type of the Entity's Primary Key: Integer (inherited from User)

    // You can add custom query methods here if needed, 
    // but for simple lookups, Spring does the heavy lifting.
}