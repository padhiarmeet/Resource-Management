package com.project.resource_management.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.resource_management.Model.Facility;

@Repository
public interface FacilityRepo extends JpaRepository<Facility,Integer>{

    @Query("SELECT f FROM Facility f WHERE f.resource.resource_id = :id")
    List<Facility> findByResource_Resource_id(@Param("id") int resourceId);
}
