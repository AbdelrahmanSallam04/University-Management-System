package com.university.backend.model.ResourceAllocation.EquipmentEAV;

import jakarta.persistence.*;

@Entity
@Table(name = "equipment_attributes")
public class EquipmentAttributes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "equipment_attribute_id")
    private Integer equipmentAttributeId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

//    @Enumerated(EnumType.STRING)
//    private DataType datatype;
}
//
//enum DataType {
//    STRING,
//    INTEGER,
//    DECIMAL,
//    BOOLEAN,
//    DATETIME
//}
