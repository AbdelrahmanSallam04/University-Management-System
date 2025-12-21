package com.university.backend.service;

import com.university.backend.dto.EquipmentAllocationDTO;
import com.university.backend.dto.EquipmentDTO;
import com.university.backend.model.ResourceAllocation.EquipmentEAV.EquipmentValues;
import com.university.backend.repository.ResourceAllocationRepository.EquipmentAllocationRepository.EquipmentDepartmentRepository;
import com.university.backend.repository.ResourceAllocationRepository.EquipmentAllocationRepository.EquipmentFacultyRepository;
import com.university.backend.repository.ResourceAllocationRepository.EquipmentAllocationRepository.EquipmentStudentRepository;
import com.university.backend.repository.ResourceAllocationRepository.EquipmentValueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipmentService {

    private final EquipmentDepartmentRepository equipmentDepartmentRepository;
    private final EquipmentFacultyRepository equipmentFacultyRepository;
    private final EquipmentStudentRepository equipmentStudentRepository;
    private final EquipmentValueRepository equipmentValueRepository;

    public List<EquipmentAllocationDTO> getDepartmentEquipments() {

        List<EquipmentAllocationDTO> departmentEquipments = equipmentDepartmentRepository.findAllDepartmentEquipmentsWithNames();
        return departmentEquipments;
    }

    public List<EquipmentAllocationDTO> getFacultyEquipments() {

        List<EquipmentAllocationDTO> facultyEquipments = equipmentFacultyRepository.findAllFacultyEquipmentsWithNames();
        return facultyEquipments;
    }

    public List<EquipmentAllocationDTO> getStudentEquipments() {

        List<EquipmentAllocationDTO> studentEquipments = equipmentStudentRepository.findAllStudentEquipmentsWithNames();
        return studentEquipments;
    }

    public List<EquipmentDTO> getEquipmentById(Integer equipmentId) {
        List<EquipmentDTO> equipmentValues = equipmentValueRepository.findByEquipmentId(equipmentId);
        return equipmentValues;
    }
}
