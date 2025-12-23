package com.university.backend.service;
import com.university.backend.dto.MaintenanceRequestDTO;
import com.university.backend.dto.MaintenanceResponseDTO;
import com.university.backend.dto.UpdatePriorityDTO;
import com.university.backend.dto.UpdateStatusDTO;
import com.university.backend.model.MaintenancePriority;
import com.university.backend.model.MaintenanceReport;
import com.university.backend.model.MaintenanceStatus;
import com.university.backend.model.User;
import com.university.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceReportRepository reportRepository;
    private final RoomRepository roomRepository;
    private final MaintenanceStatusRepository statusRepository;
    private final MaintenancePriorityRepository priorityRepository;
    private final UserRepository userRepository;

    // 1. Faculty: Create a new report
    public void createReport(MaintenanceRequestDTO dto, Integer reporterId) {
        MaintenanceReport report = new MaintenanceReport();

        report.setRoom(roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found")));
        report.setPriority(priorityRepository.findById(dto.getPriorityId())
                .orElseThrow(() -> new RuntimeException("Priority not found")));
        report.setReporter(userRepository.findById(reporterId)
                .orElseThrow(() -> new RuntimeException("User not found")));

        // Default status is always 'PENDING' for new reports
        report.setStatus(statusRepository.findByName("Pending"));
        report.setDescription(dto.getDescription());
        report.setCreatedAt(LocalDateTime.now());

        reportRepository.save(report);
    }

    // 2. Admin: Update Status (and assign Admin)
    public void updateStatus(UpdateStatusDTO dto, Integer adminId) {
        MaintenanceReport report = reportRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Report not found"));

        MaintenanceStatus newStatus = statusRepository.findById(dto.getStatusId())
                .orElseThrow(() -> new RuntimeException("Status not found"));

        report.setStatus(newStatus);

        // Assignment Logic: Link the admin to the report only when they update the status
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        report.setAdmin(admin);

        reportRepository.save(report);
    }

    // 3. Admin: Update Priority (Does NOT assign admin)
    public void updatePriority(UpdatePriorityDTO dto) {
        MaintenanceReport report = reportRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Report not found"));

        MaintenancePriority newPriority = priorityRepository.findById(dto.getPriorityId())
                .orElseThrow(() -> new RuntimeException("Priority not found"));

        report.setPriority(newPriority);
        reportRepository.save(report);
    }

    public List<MaintenanceResponseDTO> getAllReports() {
        return reportRepository.findAll().stream().map(report -> {
            MaintenanceResponseDTO res = new MaintenanceResponseDTO();
            res.setId(report.getId());
            // Using room_code as requested
            res.setRoomName(report.getRoom().getRoom_code());
            res.setReporterName(report.getReporter().getFirstName() + " " + report.getReporter().getLastName());
            res.setAdminName(report.getAdmin() != null ? report.getAdmin().getFirstName() + " " + report.getAdmin().getLastName() : "Unassigned");

            // MAP THE IDS HERE
            res.setStatusName(report.getStatus().getName());
            res.setStatusId(report.getStatus().getId()); // CRITICAL

            res.setPriorityLevel(report.getPriority().getLevel());
            res.setPriorityId(report.getPriority().getId()); // CRITICAL

            res.setDescription(report.getDescription());
            res.setCreatedAt(report.getCreatedAt());
            return res;
        }).collect(Collectors.toList());
    }

}
