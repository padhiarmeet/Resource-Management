package com.project.resource_management.Dtos;

import lombok.Data;

@Data
public class ShelfDTO {
    private int shelf_number;
    private int capacity;
    private String description;
    private int cupboard_id; 
}
