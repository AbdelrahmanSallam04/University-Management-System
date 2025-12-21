package com.university.backend.service;

import com.university.backend.dto.AnnouncementDTO;
import com.university.backend.model.AnnnouncementEAV.*;
import com.university.backend.repository.AnnouncementRepository.AnnouncementAttributeRepository;
import com.university.backend.repository.AnnouncementRepository.AnnouncementEntityRepository;
import com.university.backend.repository.AnnouncementRepository.AnnouncementValueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementEntityRepository entityRepository;
    private final AnnouncementAttributeRepository attributeRepository;
    private final AnnouncementValueRepository valueRepository;

    private static final List<String> MANDATORY_KEYS = List.of("Title", "Date", "Content", "Summary");

    @Transactional
    public void createAnnouncement(AnnouncementDTO request) {
        if (request.getAttributes() == null ||
                !request.getAttributes().keySet().containsAll(MANDATORY_KEYS)) {
            throw new IllegalArgumentException("Missing mandatory attributes. Required: " + MANDATORY_KEYS);
        }

        AnnouncementEntities entity = AnnouncementEntities.builder()
                .announcementName(request.getName())
                .build();

        AnnouncementEntities savedEntity = entityRepository.save(entity);

        request.getAttributes().forEach((key, value) -> {
            if (value != null) {
                saveAttribute(savedEntity, key, value);
            }
        });
    }

    private void saveAttribute(AnnouncementEntities entity, String key, Object rawValue) {
        AnnouncementAttributes attribute = attributeRepository.findByName(key)
                .orElseGet(() -> attributeRepository.save(
                        AnnouncementAttributes.builder().name(key).build()
                ));

        AnnouncementValues valueEntry = AnnouncementValues.builder()
                .announcement(entity)
                .attribute(attribute)
                .stringValue(String.valueOf(rawValue))
                .build();

        valueRepository.save(valueEntry);
    }

    // --- NEW FUNCTIONS ---

    /**
     * Fetches all announcements and transforms them into DTOs
     */
    public List<AnnouncementDTO> getAllAnnouncements() {
        return entityRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Fetches a single announcement by ID for the details page
     */
    public AnnouncementDTO getAnnouncementById(Integer id) {
        AnnouncementEntities entity = entityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found with ID: " + id));
        return mapToDTO(entity);
    }

    /**
     * Helper to transform EAV Entity structure to a flat DTO
     */
    private AnnouncementDTO mapToDTO(AnnouncementEntities entity) {
        AnnouncementDTO dto = new AnnouncementDTO();
        dto.setName(entity.getAnnouncementName());

        Map<String, Object> attributes = new HashMap<>();

        // Ensure the ID is included in attributes so the frontend can use it for routing
        attributes.put("id", entity.getId());

        // Map each EAV value back to the attributes map
        if (entity.getValues() != null) {
            for (AnnouncementValues val : entity.getValues()) {
                attributes.put(val.getAttribute().getName(), val.getStringValue());
            }
        }

        dto.setAttributes(attributes);
        return dto;
    }
}