package com.university.backend.model.ResourceAllocation.EquipmentAllocation;

import com.university.backend.model.ResourceAllocation.EquipmentEAV.EquipmentEntities;
import com.university.backend.model.Student;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(
        name = "equipment_student_allocation",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"equipment_id", "student_id"})
        }
)
public class EquipmentStudentAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "equipment_allocation_id")
    private Integer allocationId;

    @ManyToOne
    @JoinColumn(name = "equipment_id", nullable = false)
    private EquipmentEntities equipment;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
}
