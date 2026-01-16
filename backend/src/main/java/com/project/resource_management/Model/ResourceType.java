package com.project.resource_management.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "resource_types")
public class ResourceType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    
    private int resource_type_id;
    private String type_name;
}
