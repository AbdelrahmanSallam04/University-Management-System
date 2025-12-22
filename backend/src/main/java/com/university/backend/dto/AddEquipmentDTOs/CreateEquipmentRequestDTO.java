package com.university.backend.dto.AddEquipmentDTOs;

import com.university.backend.model.AccountType;
import lombok.Data;
import java.util.List;

@Data
public class CreateEquipmentRequestDTO {
    private String equipmentName;
    private String allocatedToType; // "department", "faculty", or "student"
    private Integer allocatedToId;  // departmentId, facultyId, or studentId
    private List<EquipmentAttributeDTO> attributes;
}