package com.university.backend.repository.AnnouncementRepository;

import com.university.backend.model.AnnnouncementEAV.AnnouncementAttributes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AnnouncementAttributeRepository extends JpaRepository<AnnouncementAttributes, Integer> {
    Optional<AnnouncementAttributes> findByName(String name);
}
