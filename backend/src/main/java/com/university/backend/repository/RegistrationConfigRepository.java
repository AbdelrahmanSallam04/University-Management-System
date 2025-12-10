package com.university.backend.repository;

import com.university.backend.model.RegistrationConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RegistrationConfigRepository extends JpaRepository<RegistrationConfig, Integer> {
    Optional<RegistrationConfig> findFirstByOrderByIdDesc();
}