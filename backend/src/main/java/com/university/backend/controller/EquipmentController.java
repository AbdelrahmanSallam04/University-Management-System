package com.university.backend.controller;

import com.university.backend.dto.AddEquipmentDTOs.CreateEquipmentRequestDTO;
import com.university.backend.dto.AddEquipmentDTOs.CreateEquipmentResponseDTO;
import com.university.backend.dto.AddEquipmentDTOs.EquipmentAttributeDTO;
import com.university.backend.dto.EquipmentAllocationDTO;
import com.university.backend.dto.EquipmentDTO;
import com.university.backend.model.Department;
import com.university.backend.model.ResourceAllocation.EquipmentEAV.EquipmentAttributes;
import com.university.backend.model.ResourceAllocation.EquipmentEAV.EquipmentEntities;
import com.university.backend.model.ResourceAllocation.EquipmentEAV.EquipmentValues;
import com.university.backend.model.StaffMember;
import com.university.backend.model.Student;
import com.university.backend.repository.DepartmentRepository;
import com.university.backend.repository.StaffMemberRepository;
import com.university.backend.repository.StudentRepository;
import com.university.backend.service.EquipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.university.backend.repository.ResourceAllocationRepository.EquipmentEAVRepository.EquipmentAttributeRepository;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")

public class EquipmentController {

    private final EquipmentService equipmentService;
    private final EquipmentAttributeRepository equipmentAttributeRepository;

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

    @PostMapping("/add")
    public void addEquipment(@RequestBody CreateEquipmentRequestDTO equipment) {
        equipmentService.addEquipment(equipment);
    }

    @GetMapping("/departments/list")
    public ResponseEntity<List<Department>> getAllDepartments() {
        List<Department> departments = equipmentService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }

    @GetMapping("/faculty/search")
    public ResponseEntity<List<StaffMember>> searchFaculty(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String name) {
        List<StaffMember> faculty = equipmentService.searchFaculty(email, name);
        return ResponseEntity.ok(faculty);
    }

    @GetMapping("/students/search")
    public ResponseEntity<List<Student>> searchStudents(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String name) {
        List<Student> students = equipmentService.searchStudents(email, name);
        return ResponseEntity.ok(students);
    }

//    @GetMapping("/attributes")
//    public ResponseEntity<List<EquipmentAttributeDTO>> getAllAttributes() {
//        try {
//            List<EquipmentAttributes> attributes = equipmentAttributeRepository.findAll();
//            List<EquipmentAttributeDTO> attributeDTOs = attributes.stream()
//                    .map(attr -> {
//                        EquipmentAttributeDTO dto = new EquipmentAttributeDTO();
//                        dto.setAttributeId(attr.getAttributeId());
//                        dto.setAttributeName(attr.getName()); // Assuming EquipmentAttributes has getName()
//                        dto.setAttributeValue(""); // Empty value for dropdown
//                        return dto;
//                    })
//                    .collect(Collectors.toList());
//            return ResponseEntity.ok(attributeDTOs);
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body(Collections.emptyList());
//        }
//    }
}