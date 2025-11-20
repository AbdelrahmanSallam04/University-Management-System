package com.university.backend.repository;

import com.university.backend.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookingStatusRepository extends JpaRepository<BookingStatus, Integer> {

    // Allows service layer to fetch status by its name, if needed for admin logic
    Optional<BookingStatus> findByStatus(String status);
}