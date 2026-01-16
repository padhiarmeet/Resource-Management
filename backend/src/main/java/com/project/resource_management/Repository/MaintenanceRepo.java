package com.project.resource_management.Repository;


import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.project.resource_management.Model.Maintenance;

@Repository
public interface MaintenanceRepo extends JpaRepository<Maintenance, Integer> {
    
    // Find by status
    List<Maintenance> findByStatus(String status);

    // Find all maintenance for a specific resource ID
    @Query("SELECT m FROM Maintenance m WHERE m.resource.resource_id = :id")
    List<Maintenance> findByResource_Resource_id(@Param("id") int resourceId); 
}
