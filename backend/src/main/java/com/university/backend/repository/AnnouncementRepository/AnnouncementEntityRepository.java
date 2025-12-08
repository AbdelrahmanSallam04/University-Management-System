package com.university.backend.repository.AnnouncementRepository;

import com.university.backend.model.AnnnouncementEAV.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnouncementEntityRepository extends JpaRepository<AnnouncementEntities, Integer> {}

