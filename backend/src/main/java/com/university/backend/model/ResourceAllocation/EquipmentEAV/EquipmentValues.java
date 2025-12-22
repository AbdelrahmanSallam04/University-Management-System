package com.university.backend.model.ResourceAllocation.EquipmentEAV;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "equipment_values")
public class EquipmentValues {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "equipment_value_id")
    private Integer equipmentValueId;

    @ManyToOne
    @JoinColumn(name = "equipment_id", nullable = false)
    private EquipmentEntities equipment;

    @ManyToOne
    @JoinColumn(name = "equipment_attribute_id", nullable = false)
    private EquipmentAttributes attribute;

    @Column(name = "value", columnDefinition = "TEXT")
    private String value;
}
