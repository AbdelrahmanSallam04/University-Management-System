package com.university.backend.model.AnnouncementEAV;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "announcement_values")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnouncementValues {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "announcement_id", nullable = false)
    private AnnouncementEntities announcement;

    @ManyToOne
    @JoinColumn(name = "attribute_id", nullable = false)
    private AnnouncementAttributes attribute;

    private String stringValue;
    private float decimalValue;
    private Integer integerValue;
    private LocalDate dateValue;
    private Boolean booleanValue;
}
