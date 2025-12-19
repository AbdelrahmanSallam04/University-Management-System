package com.university.backend.model.ResourceAllocation.EquipmentAllocation;

import com.university.backend.model.Department;
import com.university.backend.model.ResourceAllocation.EquipmentEAV.EquipmentEntities;
import jakarta.persistence.*;

@Entity
@Table(
        name = "equipment_department_allocation",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"equipment_id", "department_id"})
        }
)
public class EquipmentDepartmentAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "equipment_allocation_id")
    private Integer allocationId;

    @ManyToOne
    @JoinColumn(name = "equipment_id", nullable = false)
    private EquipmentEntities equipment;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;
}
