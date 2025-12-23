package com.university.backend.repository;

import com.university.backend.model.Professor;
import com.university.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {

    // Or if you don't need courses immediately:
    Optional<Student> findByUserId(int userId);
    // Search by student name
    List<Student> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);

    // Search by email (through Account relationship)
    @Query("SELECT s FROM Student s JOIN s.account a WHERE LOWER(a.email) LIKE LOWER(CONCAT('%', :email, '%'))")
    List<Student> findByEmailContainingIgnoreCase(@Param("email") String email);

    // Combined search (name or email)
    @Query("SELECT s FROM Student s WHERE " +
            "LOWER(s.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(s.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(s.account.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Student> searchByNameOrEmail(@Param("searchTerm") String searchTerm);
}