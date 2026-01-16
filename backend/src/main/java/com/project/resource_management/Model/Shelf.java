package com.project.resource_management.Model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "shelves")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Shelf {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int shelf_id;

    @Column(name = "shelf_number")
    private int shelf_number;

    @Column(name = "capacity")
    private int capacity;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Links the Shelf to a specific Cupboard
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cupboard_id", nullable = false)
    private Cupboard cupboard; 
}