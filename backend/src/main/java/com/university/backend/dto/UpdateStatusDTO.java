package com.university.backend.dto;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter
@Getter
public class UpdateStatusDTO {
    private Integer id;
    private Integer statusId;
}
