package com.university.backend.controller;

import com.university.backend.dto.EquipmentAllocationDTO;
import com.university.backend.dto.EquipmentDTO;
import com.university.backend.model.ResourceAllocation.EquipmentEAV.EquipmentEntities;
import com.university.backend.model.ResourceAllocation.EquipmentEAV.EquipmentValues;
import com.university.backend.service.EquipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")

public class EquipmentController {

    private final EquipmentService equipmentService;

    @GetMapping("/filters/departments")
    public ResponseEntity<List<EquipmentAllocationDTO>> getDepartmentEquipments() {
        List<EquipmentAllocationDTO> departmentEquipments = equipmentService.getDepartmentEquipments();
        return ResponseEntity.ok(departmentEquipments);
    }

    @GetMapping("/filters/faculty")
    public ResponseEntity<List<EquipmentAllocationDTO>> getFacultyEquipments() {
        List<EquipmentAllocationDTO> facultyEquipments = equipmentService.getFacultyEquipments();
        return ResponseEntity.ok(facultyEquipments);
    }

    @GetMapping("/filters/students")
    public ResponseEntity<List<EquipmentAllocationDTO>> getStudentEquipments() {
        List<EquipmentAllocationDTO> studentEquipments = equipmentService.getStudentEquipments();
        return ResponseEntity.ok(studentEquipments);
    }

    @GetMapping("/{equipmentId}")
    public ResponseEntity<List<EquipmentDTO>> getEquipmentById(@PathVariable Integer equipmentId) {
        List<EquipmentDTO> equipmentValues = equipmentService.getEquipmentById(equipmentId);
        return ResponseEntity.ok(equipmentValues);
    }
}
