package com.project.resource_management.Model;

import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "maintenance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int maintenance_id;

    @Column(name = "maintenance_type", length = 100)
    private String maintenance_type;

    @Column(name = "scheduled_date")
    private LocalDate scheduled_date;

    @Column(length = 20)
    private String status; 

    @Column(columnDefinition = "TEXT")
    private String notes;
 
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resource_id", nullable = false)
    private Resources resource;
}