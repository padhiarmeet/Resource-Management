package com.project.resource_management.Dtos;

import lombok.Data;

@Data
public class ResourceDto {
    private String resource_name;
    private String description;
    private int floor_number;
    private int building_id;
    private int resource_type_id;
}
