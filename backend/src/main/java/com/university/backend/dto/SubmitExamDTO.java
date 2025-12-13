package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmitExamDTO {
    private Integer examId;
    private String answers;
    private Integer timeTakenMinutes;
}
