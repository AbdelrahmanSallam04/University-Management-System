package com.university.backend.dto.AddEquipmentDTOs;

import lombok.Data;

@Data
public class EquipmentAttributeDTO {
    private Integer attributeId;    // From EquipmentAttributes table
    private String attributeValue;  // Value entered by user
}