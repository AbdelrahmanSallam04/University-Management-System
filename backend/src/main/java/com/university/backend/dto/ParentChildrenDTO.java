package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class ParentChildrenDTO {
    private List<StudentDashboardDTO> children;
}
