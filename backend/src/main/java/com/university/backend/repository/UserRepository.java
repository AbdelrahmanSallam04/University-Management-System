package com.university.backend.repository;
import com.university.backend.model.Account;
import com.university.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long>
{
    @Query("SELECT u FROM User u WHERE u.account.id = :accountId")
    User findUserByAccountId(@Param("accountId") int accountId);
}
