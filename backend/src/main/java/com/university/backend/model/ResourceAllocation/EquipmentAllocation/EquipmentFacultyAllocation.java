package com.university.backend.model.ResourceAllocation.EquipmentAllocation;

import com.university.backend.model.ResourceAllocation.EquipmentEAVw.EquipmentEntities;
import com.university.backend.model.StaffMember;
import jakarta.persistence.*;

@Entity
@Table(
        name = "equipment_faculty_allocation",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"equipment_id", "staff_id"})
        }
)
public class EquipmentFacultyAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "equipment_allocation_id")
    private Integer allocationId;

    @ManyToOne
    @JoinColumn(name = "equipment_id", nullable = false)
    private EquipmentEntities equipment;

    @ManyToOne
    @JoinColumn(name = "staff_id", nullable = false)
    private StaffMember staff;
}
