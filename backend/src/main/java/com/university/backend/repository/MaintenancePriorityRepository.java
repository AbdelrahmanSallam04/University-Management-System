package com.university.backend.repository;

import com.university.backend.model.MaintenancePriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaintenancePriorityRepository extends JpaRepository<MaintenancePriority, Integer> {
}
