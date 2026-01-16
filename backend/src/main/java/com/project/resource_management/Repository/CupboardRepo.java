package com.project.resource_management.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.resource_management.Model.Cupboard;

@Repository
public interface CupboardRepo extends JpaRepository<Cupboard, Integer> {
    
    // Find all cupboards in Resource ID 5
    @Query("SELECT c FROM Cupboard c WHERE c.resource.resource_id = :id")
    List<Cupboard> findByResource_Resource_id(@Param("id") int id);
}