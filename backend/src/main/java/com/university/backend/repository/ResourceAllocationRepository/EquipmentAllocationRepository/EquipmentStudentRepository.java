// EquipmentStudentAllocationRepository.java
package com.university.backend.repository.ResourceAllocationRepository.EquipmentAllocationRepository;

import com.university.backend.dto.EquipmentAllocationDTO;
import com.university.backend.model.ResourceAllocation.EquipmentAllocation.EquipmentStudentAllocation;
import com.university.backend.model.ResourceAllocation.EquipmentEAV.EquipmentEntities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EquipmentStudentRepository extends JpaRepository<EquipmentStudentAllocation, Integer> {

    @Query("SELECT ee FROM EquipmentEntities ee JOIN EquipmentStudentAllocation esa ON ee.equipmentId = esa.equipment.equipmentId")
    List<EquipmentEntities> findAllStudentEquipments();

    @Query("SELECT new com.university.backend.dto.EquipmentAllocationDTO(" +
            "ee.equipmentId, ee.name, s.firstName, s.lastName, s.userId) " +
            "FROM EquipmentEntities ee " +
            "JOIN EquipmentStudentAllocation esa ON ee.equipmentId = esa.equipment.equipmentId " +
            "JOIN Student s ON esa.student.userId = s.userId ")
    List<EquipmentAllocationDTO> findAllStudentEquipmentsWithNames();
}