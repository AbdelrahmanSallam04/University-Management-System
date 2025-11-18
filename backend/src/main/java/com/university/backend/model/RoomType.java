package com.university.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "room_type")
public class RoomType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private int room_id;

    @Column(name = "type", nullable = false, length = 100)
    private String type;
}
