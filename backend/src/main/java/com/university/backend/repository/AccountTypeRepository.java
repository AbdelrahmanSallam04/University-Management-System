package com.university.backend.repository;

import com.university.backend.model.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AccountTypeRepository extends JpaRepository<AccountType, Integer> {
    @Query ("SELECT at.id FROM AccountType at WHERE at.name = ?1")
    Integer findIdByName(String name);
}