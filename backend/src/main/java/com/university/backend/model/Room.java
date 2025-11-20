package com.university.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "room")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private int room_id;

    @Column(name = "room_code", nullable = false, length = 100)
    private String room_code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type", nullable = false)
    private RoomType room_type;

    @Column(name = "building", nullable = false, length = 100)
    private String building;

    @Column(name = "floor")
    private int floor;

    @Column(name = "capacity")
    private int capacity;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "isActive", nullable = false)
    private boolean isActive;


}
