package com.university.backend.repository;

import com.university.backend.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long>
{
    Account findByEmail(String username);
    boolean existsByEmail(String email);
    //Optional<Account> findByEmail(String email);
}
