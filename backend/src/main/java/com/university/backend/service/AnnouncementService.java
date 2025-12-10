package com.university.backend.service;

import com.university.backend.dto.AnnouncementDTO;
import com.university.backend.model.AnnnouncementEAV.*;
import com.university.backend.repository.AnnouncementRepository.AnnouncementAttributeRepository;
import com.university.backend.repository.AnnouncementRepository.AnnouncementEntityRepository;
import com.university.backend.repository.AnnouncementRepository.AnnouncementValueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementEntityRepository entityRepository;
    private final AnnouncementAttributeRepository attributeRepository;
    private final AnnouncementValueRepository valueRepository;

    // 1. Define the list of attributes that MUST be present
    // Adjust these strings to match exactly what your Frontend sends
    private static final List<String> MANDATORY_KEYS = List.of("Title", "Date", "Content","Summary");

    @Transactional
    public void createAnnouncement(AnnouncementDTO request) {

        // 2. Validation: Check if all mandatory keys exist in the request
        if (request.getAttributes() == null ||
                !request.getAttributes().keySet().containsAll(MANDATORY_KEYS)) {
            throw new IllegalArgumentException("Missing mandatory attributes. Required: " + MANDATORY_KEYS);
        }

        // 3. Create and Save the Parent Entity
        AnnouncementEntities entity = AnnouncementEntities.builder()
                .announcementName(request.getName())
                .build();

        AnnouncementEntities savedEntity = entityRepository.save(entity);

        // 4. Loop through dynamic attributes and save them
        request.getAttributes().forEach((key, value) -> {
            if (value != null) {
                saveAttribute(savedEntity, key, value);
            }
        });
    }

    private void saveAttribute(AnnouncementEntities entity, String key, Object rawValue) {
        // A. Check if the Attribute definition exists, if not, create it
        AnnouncementAttributes attribute = attributeRepository.findByName(key)
                .orElseGet(() -> attributeRepository.save(
                        AnnouncementAttributes.builder().name(key).build()
                ));

        // B. Save the Value as a String
        AnnouncementValues valueEntry = AnnouncementValues.builder()
                .announcement(entity)
                .attribute(attribute)
                .stringValue(String.valueOf(rawValue))
                .build();

        valueRepository.save(valueEntry);
    }
}