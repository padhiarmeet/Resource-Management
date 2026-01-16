package com.project.resource_management.Dtos;

import java.time.LocalDate;
import lombok.Data;

@Data
public class MaintenanceDTO {
   
    private int resource_id;     
    private String maintenance_type;
    private LocalDate scheduled_date;
    private String notes;
    private String status;
}