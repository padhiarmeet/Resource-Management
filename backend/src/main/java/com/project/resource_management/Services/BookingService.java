package com.project.resource_management.Services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.resource_management.Model.Bookings;
import com.project.resource_management.Model.Resources;
import com.project.resource_management.Model.Users;
import com.project.resource_management.Repository.BookingsRepo;
import com.project.resource_management.Repository.ResourcesRepo;
import com.project.resource_management.Repository.UsersRepo;

@Service
public class BookingService {

    @Autowired
    private BookingsRepo bookingRepo;

    @Autowired
    private ResourcesRepo resourceRepo;

    @Autowired
    private UsersRepo userRepo;

    public List<Bookings> getAllBookings() {
        return bookingRepo.findAll();
    }

    public Bookings getBookingById(int id) {
        return bookingRepo.findById(id).orElse(null);
    }

    public List<Bookings> getBookingsByUserId(int userId) {
        return bookingRepo.findByUser_UserId(userId);
    }

    public List<Bookings> getPendingBookings() {
        return bookingRepo.findByStatus("PENDING");
    }

    @Autowired
    private com.project.resource_management.Repository.ShelfRepo shelfRepo;

    public Bookings createBooking(Bookings booking, int userId, int resourceId, Integer shelfId) {

        if (booking.getStartDatetime().isAfter(booking.getEndDatetime())) {
            throw new RuntimeException("Start time must be before End time");
        }

        if (booking.getStartDatetime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot book in the past");
        }

        if (shelfId != null) {
            // Check Is the shelf free?
            List<Bookings> conflicts = bookingRepo.findConflictingShelfBookings(
                    shelfId,
                    booking.getStartDatetime(),
                    booking.getEndDatetime());

            if (!conflicts.isEmpty()) {
                throw new RuntimeException("Shelf is already booked for this time slot!");
            }

            com.project.resource_management.Model.Shelf shelf = shelfRepo.findById(shelfId)
                    .orElseThrow(() -> new RuntimeException("Shelf not found"));
            booking.setShelf(shelf);

            // If booking a shelf, we still link the resource (Cupboard's resource) or maybe
            // just kept resourceId passed?
            // Usually good to keep the resource link for easier querying
            Resources resource = resourceRepo.findById(resourceId)
                    .orElseThrow(() -> new RuntimeException("Resource not found"));
            booking.setResource(resource);

        } else {
            // Check Is the room free ?
            List<Bookings> conflicts = bookingRepo.findConflictingBookings(
                    resourceId,
                    booking.getStartDatetime(),
                    booking.getEndDatetime());

            // It means that already one meeting exist in that slot
            if (!conflicts.isEmpty()) {
                throw new RuntimeException("Resource is already booked for this time slot!");
            }

            Resources resource = resourceRepo.findById(resourceId)
                    .orElseThrow(() -> new RuntimeException("Resource not found"));
            booking.setResource(resource);
        }

        Users user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("Users not found"));

        booking.setUser(user);
        booking.setStatus("PENDING");

        return bookingRepo.save(booking);
    }

    // Approve or reject Bookings
    public Bookings updateBookingStatus(int bookingId, String newStatus, int approverId) {
        Bookings booking = bookingRepo.findById(bookingId).orElse(null);

        if (booking != null) {

            if (!newStatus.equals("APPROVED") && !newStatus.equals("REJECTED")) {
                throw new RuntimeException("Invalid Status. Use APPROVED or REJECTED.");
            }

            booking.setStatus(newStatus);

            // Set approver (Who want to book that !) / (who clicked button !)
            Users approver = userRepo.findById(approverId)
                    .orElseThrow(() -> new RuntimeException("Approver not found"));
            booking.setApprover(approver);

            return bookingRepo.save(booking);
        }
        return null;
    }

    public boolean deleteBooking(int id) {
        if (bookingRepo.existsById(id)) {
            bookingRepo.deleteById(id);
            return true;
        }
        return false;
    }
}