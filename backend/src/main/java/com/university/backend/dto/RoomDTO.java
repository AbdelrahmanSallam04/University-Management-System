package com.university.backend.dto;

import com.university.backend.model.Room;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomDTO {
    private Integer id;
    private String roomCode;
    private String roomType;
    private Integer capacity;
    private String building;
    private Integer floor;
    private Boolean isActive;

    public static RoomDTO fromEntity(Room room) {
        return RoomDTO.builder()
                .id(room.getRoom_id())
                .roomCode(room.getRoom_code())
                .roomType(room.getRoom_type() != null ? room.getRoom_type().getType() : "Unknown")
                .capacity(room.getCapacity())
                .building(room.getBuilding())
                .floor(room.getFloor())
                .isActive(room.isActive())
                .build();
    }
}