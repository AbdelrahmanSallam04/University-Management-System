package com.university.backend.dto;

import lombok.Data;

@Data
public class EquipmentDTO {
    private Integer equipmentId;
    private String equipmentName;
    private Integer equipmentAttributeId;
    private String equipmentAttributeName;
    private Integer equipmentValueId;
    private String equipmentValueName;

    public EquipmentDTO(Integer equipmentId, String equipmentName,
                        Integer equipmentAttributeId, String equipmentAttributeName,
                        Integer equipmentValueId, String equipmentValueName) {
        this.equipmentId = equipmentId;
        this.equipmentName = equipmentName;
        this.equipmentAttributeId = equipmentAttributeId;
        this.equipmentAttributeName = equipmentAttributeName;
        this.equipmentValueId = equipmentValueId;
        this.equipmentValueName = equipmentValueName;
    }
}