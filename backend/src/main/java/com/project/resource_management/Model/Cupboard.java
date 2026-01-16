package com.project.resource_management.Model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cupboards") 
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cupboard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cupboard_id;

    @Column(name = "cupboard_name", length = 100)
    private String cupboard_name;

    @Column(name = "total_shelves")
    private int total_shelves;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resource_id", nullable = false)
    private Resources resource; 
}