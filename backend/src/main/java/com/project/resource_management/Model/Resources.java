package com.project.resource_management.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "resources")
public class Resources {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int resource_id;
    private String resource_name;

    // FetchType.EAGER means telling application that immidiatly load data immidiatly along with main data !
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resource_type_id", nullable = false)
    private ResourceType resourceType;

    @ManyToOne(fetch = FetchType.EAGER)     
    @JoinColumn(name = "building_id", nullable = false) 
    private Building building;
    private int floor_number;
    private String description;
}
