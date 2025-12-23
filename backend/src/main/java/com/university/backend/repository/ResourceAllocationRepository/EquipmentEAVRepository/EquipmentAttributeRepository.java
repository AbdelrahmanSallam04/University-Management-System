    package com.university.backend.repository.ResourceAllocationRepository.EquipmentEAVRepository;

    import com.university.backend.dto.EquipmentDTO;
    import com.university.backend.model.ResourceAllocation.EquipmentEAV.EquipmentAttributes;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.data.repository.query.Param;
    import org.springframework.stereotype.Repository;

    import java.util.List;

    @Repository
    public interface EquipmentAttributeRepository extends JpaRepository<EquipmentAttributes, Integer> {

        @Query("SELECT new com.university.backend.dto.EquipmentDTO(" +
                "e.equipmentId, e.name, " +
                "ea.equipmentAttributeId, ea.name, " +
                "ev.equipmentValueId, ev.value) " +
                "FROM EquipmentValues ev " +
                "JOIN ev.equipment e " +
                "JOIN ev.attribute ea " +
                "WHERE e.equipmentId = :equipmentId")
        List<EquipmentDTO> findByEquipmentId(@Param("equipmentId") Integer equipmentId);

        List<EquipmentAttributes> findAll();
    }
