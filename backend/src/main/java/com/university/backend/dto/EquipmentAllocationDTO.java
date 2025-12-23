package com.university.backend.dto;

import lombok.Data;

@Data
public class EquipmentAllocationDTO {
    private Integer equipmentId;
    private String equipmentName;
    private String allocatedToFirstName;  // Department name, Faculty name, or Student name
    private String allocatedToLastName;
    private Integer allocatedEntityId;  // Department ID, Faculty ID, or Student ID

    // Constructor for JPQL
    public EquipmentAllocationDTO(Integer equipmentId, String equipmentName,
                                  String allocatedToFirstName, String allocatedToLastName,Integer allocatedEntityId) {
        this.equipmentId = equipmentId;
        this.equipmentName = equipmentName;
        this.allocatedToFirstName = allocatedToFirstName;
        this.allocatedToLastName = allocatedToLastName;
        this.allocatedEntityId = allocatedEntityId;
    }
}