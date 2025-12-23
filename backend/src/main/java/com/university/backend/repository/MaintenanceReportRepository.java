package com.university.backend.repository;

import com.university.backend.model.MaintenanceReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface MaintenanceReportRepository extends JpaRepository<MaintenanceReport, Integer> {
    List<MaintenanceReport> findByStatusName(String statusName);
    List<MaintenanceReport> findByReporterUserId(Integer UserId);
}
