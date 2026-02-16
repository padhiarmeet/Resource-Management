package com.project.resource_management.Dtos;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class BookingRequestDTO {
    private int user_id;
    private int resource_id;
    private Integer shelf_id;
    private LocalDateTime start_datetime;
    private LocalDateTime end_datetime;
}
