package com.university.backend.dto;

import lombok.Data;
import java.util.Map;

@Data
public class AnnouncementDTO {
    // Corresponds to AnnouncementEntities.announcementName (e.g., internal system name)
    private String name;

    // Dynamic fields: "Title": "Summer Party", "Fees": 200, "Date": "2025-10-10"
    private Map<String, Object> attributes;
}