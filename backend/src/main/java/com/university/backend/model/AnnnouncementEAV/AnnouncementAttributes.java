package com.university.backend.model.AnnnouncementEAV;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "announcement_attributes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnouncementAttributes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;        // e.g., "title", "event_date", etc.

//    @Enumerated(EnumType.STRING)
//    private DataType datatype1;
//
//
//enum DataType {
//    STRING,
//    INTEGER,
//    DECIMAL,
//    BOOLEAN,
//    DATETIME
}