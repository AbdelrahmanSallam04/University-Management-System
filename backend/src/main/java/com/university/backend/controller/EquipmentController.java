package com.university.backend.controller;

import com.university.backend.model.ResourceAllocation.EquipmentEAV.EquipmentEntities;
import com.university.backend.service.EquipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/equipments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")

public class EquipmentController {

    private final EquipmentService equipmentService;

    @GetMapping("/filters/departments")
    public ResponseEntity<List<EquipmentEntities>> getDepartmentEquipments() {
        List<EquipmentEntities> departmentEquipments = equipmentService.getDepartmentEquipments();
        return ResponseEntity.ok(departmentEquipments);
    }

    @GetMapping("/filters/faculty")
    public ResponseEntity<List<EquipmentEntities>> getFacultyEquipments() {
        List<EquipmentEntities> facultyEquipments = equipmentService.getFacultyEquipments();
        return ResponseEntity.ok(facultyEquipments);
    }

    @GetMapping("/filters/students")
    public ResponseEntity<List<EquipmentEntities>> getStudentEquipments() {
        List<EquipmentEntities> studentEquipments = equipmentService.getStudentEquipments();
        return ResponseEntity.ok(studentEquipments);
    }
}
