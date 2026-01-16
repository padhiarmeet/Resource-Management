package com.project.resource_management.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.resource_management.Model.Facility;
import com.project.resource_management.Model.Resources;
import com.project.resource_management.Repository.FacilityRepo;
import com.project.resource_management.Repository.ResourcesRepo;

@Service
public class FacilityService {

    @Autowired
    private FacilityRepo facilityRepo;

    @Autowired
    private ResourcesRepo resourcesRepo;

    // 1. GET ALL
    public List<Facility> getAllFacilities() {
        return facilityRepo.findAll();
    }

    // 2. GET BY RESOURCE ID (Useful!)
    public List<Facility> getFacilitiesByResourceId(int resourceId) {
        return facilityRepo.findByResource_Resource_id(resourceId);
    }

    // 3. ADD FACILITY
    public Facility addFacility(String name, String details, int resourceId) {
        // Fetch the Resource first
        Resources resource = resourcesRepo.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource ID " + resourceId + " not found"));

        Facility facility = new Facility();
        facility.setFacility_name(name);
        facility.setDetails(details);
        facility.setResource(resource); // Link the object

        return facilityRepo.save(facility);
    }

    // 4. UPDATE FACILITY
    public Facility updateFacility(int id, String name, String details) {
        Optional<Facility> existing = facilityRepo.findById(id);

        if (existing.isPresent()) {
            Facility facility = existing.get();
            facility.setFacility_name(name);
            facility.setDetails(details);
            return facilityRepo.save(facility);
        }
        return null;
    }

    // 5. DELETE FACILITY
    public boolean deleteFacility(int id) {
        if (facilityRepo.existsById(id)) {
            facilityRepo.deleteById(id);
            return true;
        }
        return false;
    }
}