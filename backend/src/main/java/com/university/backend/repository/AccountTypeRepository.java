package com.university.backend.repository;

import com.university.backend.model.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccountTypeRepository extends JpaRepository<AccountType, Integer> {
    List<AccountType> findByName(String name); // Changed from Optional to List
}