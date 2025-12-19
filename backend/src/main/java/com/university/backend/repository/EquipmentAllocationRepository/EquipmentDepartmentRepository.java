package com.university.backend.repository.EquipmentAllocationRepository;

import com.university.backend.dto.EquipmentAllocationDTO;
import com.university.backend.model.ResourceAllocation.EquipmentAllocation.EquipmentDepartmentAllocation;
import com.university.backend.model.ResourceAllocation.EquipmentEAV.EquipmentEntities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentDepartmentRepository extends JpaRepository<EquipmentDepartmentAllocation, Integer> {

    @Query ("SELECT ee FROM EquipmentEntities ee JOIN EquipmentDepartmentAllocation eda ON ee.equipmentId = eda.equipment.equipmentId")
    List<EquipmentEntities> findAllDepartmentEquipments();

    @Query("SELECT new com.university.backend.dto.EquipmentAllocationDTO(" +
            "ee.equipmentId, ee.name, d.departmentName, '', d.departmentId) " +
            "FROM EquipmentEntities ee " +
            "JOIN EquipmentDepartmentAllocation eda ON ee.equipmentId = eda.equipment.equipmentId " +
            "JOIN Department d ON eda.department.departmentId = d.departmentId")
    List<EquipmentAllocationDTO> findAllDepartmentEquipmentsWithNames();
}
