package com.university.backend.repository;

import com.university.backend.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    // JpaRepository provides findById(Long id) which the service needs.
}