package com.project.resource_management.Repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.project.resource_management.Model.Bookings;

@Repository
public interface BookingsRepo extends JpaRepository<Bookings, Integer> {

        List<Bookings> findByUser_UserId(int userId);

        List<Bookings> findByStatus(String status);

        @Query("SELECT b FROM Bookings b WHERE b.resource.resource_id = :resource_id " +
                        "AND b.status = 'APPROVED' " +
                        "AND b.startDatetime < :end AND b.endDatetime > :start")
        List<Bookings> findConflictingBookings(int resource_id, LocalDateTime start, LocalDateTime end);

        @Query("SELECT b FROM Bookings b WHERE b.shelf.shelf_id = :shelf_id " +
                        "AND b.status = 'APPROVED' " +
                        "AND b.startDatetime < :end AND b.endDatetime > :start")
        List<Bookings> findConflictingShelfBookings(int shelf_id, LocalDateTime start, LocalDateTime end);

}
