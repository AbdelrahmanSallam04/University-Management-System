package com.university.backend.repository;

import com.university.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    @Query("SELECT s FROM Student s JOIN FETCH s.courses WHERE s.userId = :userId")
    Optional<Student> findByUserIdWithCourses(@Param("userId") Long userId);

    // Or if you don't need courses immediately:
    Optional<Student> findByUserId(Long userId);
}