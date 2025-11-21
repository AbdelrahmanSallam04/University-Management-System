package com.university.backend.model;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter

@Entity
@Table(name = "room_type")
public class RoomType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private int room_id;

    @Column(name = "type", nullable = false, length = 100)
    private String type;

    public RoomType(int id, String classroom) {
        this.room_id = id;
        this.type = classroom;
    }

    public RoomType() {

    }
}
