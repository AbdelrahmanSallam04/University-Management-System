package com.university.backend.repository;

import com.university.backend.model.MaintenanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaintenanceStatusRepository extends JpaRepository<MaintenanceStatus, Integer> {
    MaintenanceStatus findByName(String name);
}
