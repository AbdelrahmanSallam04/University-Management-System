package com.university.backend.repository;

import com.university.backend.model.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Integer> {

    // Method used in DataLoader.java for lookup by Type name
    Optional<RoomType> findByType(String type);
}