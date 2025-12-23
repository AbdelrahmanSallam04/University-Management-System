package com.university.backend.repository;

import com.university.backend.model.StaffMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffMemberRepository extends JpaRepository<StaffMember, Integer> {

    // Search by staff name
    List<StaffMember> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);

    // Search by email (through Account relationship)
    @Query("SELECT s FROM StaffMember s JOIN s.account a WHERE LOWER(a.email) LIKE LOWER(CONCAT('%', :email, '%'))")
    List<StaffMember> findByEmailContainingIgnoreCase(@Param("email") String email);

    // Combined search (name or email)
    @Query("SELECT s FROM StaffMember s WHERE " +
            "LOWER(s.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(s.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(s.account.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<StaffMember> searchByNameOrEmail(@Param("searchTerm") String searchTerm);
}