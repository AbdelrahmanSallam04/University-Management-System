package com.university.backend.repository;

import com.university.backend.model.StaffMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffMemberRepository extends JpaRepository<StaffMember, Integer> {

    StaffMember findByEmailOrName(String email, String name);
    List<StaffMember> findByEmailContainingIgnoreCase(String emailFragment);
    List<StaffMember> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstNameFragment, String lastNameFragment);
}