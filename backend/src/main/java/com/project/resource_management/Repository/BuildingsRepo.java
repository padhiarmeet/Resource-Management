package com.project.resource_management.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.resource_management.Model.Building;

@Repository
public interface BuildingsRepo extends JpaRepository<Building,Integer>{
    
}
