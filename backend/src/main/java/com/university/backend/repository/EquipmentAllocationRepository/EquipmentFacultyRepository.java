// EquipmentStaffAllocationRepository.java
package com.university.backend.repository.EquipmentAllocationRepository;

import com.university.backend.model.ResourceAllocation.EquipmentAllocation.EquipmentFacultyAllocation;
import com.university.backend.model.ResourceAllocation.EquipmentEAV.EquipmentEntities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EquipmentFacultyRepository extends JpaRepository<EquipmentFacultyAllocation, Integer> {

    @Query("SELECT ee FROM EquipmentEntities ee JOIN EquipmentFacultyAllocation esa ON ee.equipmentId = esa.equipment.equipmentId")
    List<EquipmentEntities> findAllFacultyEquipments();
}