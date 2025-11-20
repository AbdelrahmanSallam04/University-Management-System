package com.university.backend.repository;

import com.university.backend.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {

    // Custom method to fetch only active rooms
    List<Room> findByIsActiveTrue();

    // Custom method to fetch active rooms filtered by RoomType Name
    // This assumes your Room entity has a relationship to RoomType
    @Query("SELECT r FROM Room r WHERE r.isActive = TRUE AND LOWER(r.room_type.type) = LOWER(:roomType)")
    List<Room> findActiveRoomsByType(@Param("roomType") String roomType);}