package com.university.backend.repository.AnnouncementRepository;

import com.university.backend.model.AnnnouncementEAV.AnnouncementValues;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnouncementValueRepository extends JpaRepository<AnnouncementValues, Integer> {}
