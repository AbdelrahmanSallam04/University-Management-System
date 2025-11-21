package com.university.backend.repository;

import com.university.backend.model.StaffMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffMemberRepository extends JpaRepository<StaffMember, Integer> {

    // Custom query methods can be added here if needed, but the basic JPA methods are enough for now.
}