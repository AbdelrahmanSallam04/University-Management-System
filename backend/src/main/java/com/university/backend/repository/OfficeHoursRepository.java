package com.university.backend.repository;

import com.university.backend.model.OfficeHours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OfficeHoursRepository extends JpaRepository<OfficeHours, Long> {

    // IMPORTANT: Use findByStaffMember_UserId (with underscore)
    // NOT findByStaffMemberId
    List<OfficeHours> findByStaffMember_UserId(Integer userId);

    // If you need to find by StaffMember object
    List<OfficeHours> findByStaffMemberUserId(Integer userId);
}