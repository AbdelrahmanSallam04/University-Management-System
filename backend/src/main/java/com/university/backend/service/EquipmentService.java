package com.university.backend.service;

import com.university.backend.dto.AddEquipmentDTOs.CreateEquipmentRequestDTO;
import com.university.backend.dto.AddEquipmentDTOs.EquipmentAttributeDTO;
import com.university.backend.dto.EquipmentAllocationDTO;
import com.university.backend.dto.EquipmentDTO;
import com.university.backend.model.AccountType;
import com.university.backend.model.Department;
import com.university.backend.model.ResourceAllocation.EquipmentAllocation.EquipmentDepartmentAllocation;
import com.university.backend.model.ResourceAllocation.EquipmentAllocation.EquipmentFacultyAllocation;
import com.university.backend.model.ResourceAllocation.EquipmentAllocation.EquipmentStudentAllocation;
import com.university.backend.model.ResourceAllocation.EquipmentEAV.EquipmentAttributes;
import com.university.backend.model.ResourceAllocation.EquipmentEAV.EquipmentEntities;
import com.university.backend.model.ResourceAllocation.EquipmentEAV.EquipmentValues;
import com.university.backend.model.StaffMember;
import com.university.backend.model.Student;
import com.university.backend.repository.*;
import com.university.backend.repository.ResourceAllocationRepository.EquipmentAllocationRepository.EquipmentDepartmentRepository;
import com.university.backend.repository.ResourceAllocationRepository.EquipmentAllocationRepository.EquipmentFacultyRepository;
import com.university.backend.repository.ResourceAllocationRepository.EquipmentAllocationRepository.EquipmentStudentRepository;
import com.university.backend.repository.ResourceAllocationRepository.EquipmentEAVRepository.EquipmentAttributeRepository;
import com.university.backend.repository.ResourceAllocationRepository.EquipmentEAVRepository.EquipmentEntityRepository;
import com.university.backend.repository.ResourceAllocationRepository.EquipmentEAVRepository.EquipmentValueRepository;
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
    private final EquipmentEntityRepository equipmentEntityRepository;
    private final EquipmentAttributeRepository equipmentAttributeRepository;
    private final StaffMemberRepository staffMemberRepository;
    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;

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

    public void addEquipment(CreateEquipmentRequestDTO equipment) {
        System.out.println("=== ADD EQUIPMENT START ===");
        System.out.println("Equipment name: " + equipment.getEquipmentName());
        System.out.println("Allocated to type: " + equipment.getAllocatedToType());
        System.out.println("Allocated to ID: " + equipment.getAllocatedToId());
        System.out.println("Attributes count: " + (equipment.getAttributes() != null ? equipment.getAttributes().size() : 0));

        if (equipment.getAllocatedToId() == null) {
            System.err.println("ERROR: allocatedToId is NULL!");
            throw new RuntimeException("Allocated To ID cannot be null");
        }
        EquipmentEntities equipmentEntity = new EquipmentEntities();
        equipmentEntity.setName(equipment.getEquipmentName());
        equipmentEntity = equipmentEntityRepository.save(equipmentEntity);
        for (EquipmentAttributeDTO attributeDTO : equipment.getAttributes()) {
            EquipmentValues equipmentValue = new EquipmentValues();
            equipmentValue.setEquipment(equipmentEntity);
            EquipmentAttributes attribute = equipmentAttributeRepository.findById(attributeDTO.getAttributeId())
                    .orElseThrow(() -> new RuntimeException("Attribute not found with id: " + attributeDTO.getAttributeId()));
            equipmentValue.setAttribute(attribute);
            equipmentValue.setValue(attributeDTO.getAttributeValue());

            equipmentValueRepository.save(equipmentValue);
        }
        allocateTo(equipmentEntity, equipment.getAllocatedToType(), equipment.getAllocatedToId());
    }

    public void addAttribute(EquipmentAttributeDTO attributeDTO) {
        EquipmentAttributes equipmentAttribute = new EquipmentAttributes();
        equipmentAttribute.setName(attributeDTO.getAttributeValue());

        equipmentAttributeRepository.save(equipmentAttribute);
    }

    public void allocateTo(EquipmentEntities equipment, String allocatedToType, Integer allocatedToId) {
        switch (allocatedToType.toUpperCase()) {
            case "DEPARTMENT":
                EquipmentDepartmentAllocation departmentAllocation = new EquipmentDepartmentAllocation();
                departmentAllocation.setEquipment(equipment);
                departmentAllocation.setDepartment(departmentRepository.findById(allocatedToId)
                        .orElseThrow(() -> new RuntimeException("Department not found with id: " + allocatedToId)));
                equipmentDepartmentRepository.save(departmentAllocation);
                break;
            case "FACULTY":
                EquipmentFacultyAllocation facultyAllocation = new EquipmentFacultyAllocation();
                facultyAllocation.setEquipment(equipment);
                facultyAllocation.setStaff(staffMemberRepository.findById(allocatedToId)
                        .orElseThrow(() -> new RuntimeException("Staff member not found with id: " + allocatedToId)));
                equipmentFacultyRepository.save(facultyAllocation);
                break;
            case "STUDENT":
                EquipmentStudentAllocation studentAllocation = new EquipmentStudentAllocation();
                studentAllocation.setEquipment(equipment);
                studentAllocation.setStudent(studentRepository.findById(allocatedToId)
                        .orElseThrow(() -> new RuntimeException("Student not found with id: " + allocatedToId)));
                equipmentStudentRepository.save(studentAllocation);
                break;
            default:
                throw new IllegalArgumentException("Invalid account type: " + allocatedToType);
        }
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public List<StaffMember> searchFaculty(String name) {
        List<StaffMember> faculty;
        faculty = staffMemberRepository.searchByNameOrEmail(name);
        return faculty;
    }

    public List<Student> searchStudents(String name) {
        List<Student> students;
        students = studentRepository.searchByNameOrEmail(name);
        return students;
    }
}