package com.university.backend.repository;

import com.university.backend.model.TA;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TARepository extends JpaRepository<TA, Long> {
}