package com.university.backend.repository;

import com.university.backend.model.TA;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TARepository extends JpaRepository<TA, Integer> {

    // Only keep this simple query
    @Query("SELECT t FROM TA t WHERE t.userId = :userId")
    Optional<TA> findByUserId(@Param("userId") Integer userId);
}