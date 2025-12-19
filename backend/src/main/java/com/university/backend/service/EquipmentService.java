package com.university.backend.service;

import com.university.backend.model.ResourceAllocation.EquipmentEAV.EquipmentEntities;
import com.university.backend.repository.EquipmentAllocationRepository.EquipmentDepartmentRepository;
import com.university.backend.repository.EquipmentAllocationRepository.EquipmentFacultyRepository;
import com.university.backend.repository.EquipmentAllocationRepository.EquipmentStudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipmentService {

    private final EquipmentDepartmentRepository equipmentDepartmentRepository;
    private final EquipmentFacultyRepository equipmentFacultyRepository;
    private final EquipmentStudentRepository equipmentStudentRepository;

    public List<EquipmentEntities> getDepartmentEquipments() {

        List<EquipmentEntities> departmentEquipments = equipmentDepartmentRepository.findAllDepartmentEquipments();
        return departmentEquipments;
    }

    public List<EquipmentEntities> getFacultyEquipments() {

        List<EquipmentEntities> facultyEquipments = equipmentFacultyRepository.findAllFacultyEquipments();
        return facultyEquipments;
    }

    public List<EquipmentEntities> getStudentEquipments() {

        List<EquipmentEntities> studentEquipments = equipmentStudentRepository.findAllStudentEquipments();
        return studentEquipments;
    }
}
