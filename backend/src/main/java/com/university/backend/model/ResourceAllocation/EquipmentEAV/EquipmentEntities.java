package com.university.backend.model.ResourceAllocation.EquipmentEAV;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "equipment_entities")
public class EquipmentEntities {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "equipment_id")
    private Integer equipmentId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}
