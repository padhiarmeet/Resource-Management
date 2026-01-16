package com.project.resource_management.Dtos;
import lombok.Data;

@Data
public class CupboardDTO {
    private String cupboard_name;
    private int total_shelves;
    private int resource_id; 
}