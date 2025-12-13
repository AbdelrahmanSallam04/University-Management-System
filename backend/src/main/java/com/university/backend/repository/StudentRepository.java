package com.university.backend.repository;

import com.university.backend.model.Professor;
import com.university.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {

    // Or if you don't need courses immediately:
    Optional<Student> findByUserId(int userId);
}