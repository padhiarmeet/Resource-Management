package com.project.resource_management.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.resource_management.Dtos.BookingRequestDTO;
import com.project.resource_management.Model.Bookings;
import com.project.resource_management.Services.BookingService;

@RestController
@CrossOrigin
@RequestMapping("api/bookings")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @GetMapping("/")
    public ResponseEntity<List<Bookings>> getAllBuilding() {
        return new ResponseEntity<>(bookingService.getAllBookings(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBuildingById(@PathVariable int id) {
        Bookings b1 = bookingService.getBookingById(id);

        if (b1 != null) {
            return new ResponseEntity<>(b1, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Booking Id :" + id + "not found !", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUsersBooking(@PathVariable int uesrId) {
        return new ResponseEntity<>(bookingService.getBookingsByUserId(uesrId), HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<?> addBooking(@RequestBody BookingRequestDTO dataFromBody) {
        try {
            Bookings newBookings = new Bookings();

            newBookings.setStartDatetime(dataFromBody.getStart_datetime());
            newBookings.setEndDatetime(dataFromBody.getEnd_datetime());

            Bookings savedBookings = bookingService.createBooking(newBookings, dataFromBody.getUser_id(),
                    dataFromBody.getResource_id());

            return new ResponseEntity<>(savedBookings, HttpStatus.CREATED);
        } catch (RuntimeException runtimeException) {
            return new ResponseEntity<>(runtimeException.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>("Server Error !" + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Mind blowing !!💥💥
    public static class BookingStatusRequest {
        public String status;
        public int approverId;
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable int id,
            @RequestBody BookingStatusRequest bookingStatusRequest) {
        try {
            Bookings updatedBookings = bookingService.updateBookingStatus(id, bookingStatusRequest.status,
                    bookingStatusRequest.approverId);

            if (updatedBookings != null) {
                return new ResponseEntity<>(updatedBookings, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("BookingID" + id + " Not found !", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Server Error : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBookingById(@PathVariable int id) {
        boolean isDeleted = bookingService.deleteBooking(id);

        if (isDeleted) {
            return new ResponseEntity<>(true, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
