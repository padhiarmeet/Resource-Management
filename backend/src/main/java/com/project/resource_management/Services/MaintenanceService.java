package com.project.resource_management.Services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.resource_management.Dtos.MaintenanceDTO;
import com.project.resource_management.Model.Maintenance;
import com.project.resource_management.Model.Resources;
import com.project.resource_management.Repository.MaintenanceRepo;
import com.project.resource_management.Repository.ResourcesRepo;

@Service
public class MaintenanceService {

    @Autowired
    private MaintenanceRepo maintenanceRepo;

    @Autowired
    private ResourcesRepo resourceRepo;

    // 1. GET ALL
    public List<Maintenance> getAllMaintenance() {
        return maintenanceRepo.findAll();
    }

    // 2. CREATE (Updated for your specific table columns)
    public Maintenance createMaintenance(MaintenanceDTO dto) {
        // Step 1: Find the Resource object using the ID
        Resources resource = resourceRepo.findById(dto.getResource_id())
                .orElseThrow(() -> new RuntimeException("Resource ID " + dto.getResource_id() + " not found"));

        // Step 2: Create the Maintenance object
        Maintenance maintenance = new Maintenance();

        maintenance.setMaintenance_type(dto.getMaintenance_type());
        maintenance.setScheduled_date(dto.getScheduled_date());
        maintenance.setNotes(dto.getNotes());

        // Default status to "PENDING" if the frontend didn't send one
        if (dto.getStatus() == null || dto.getStatus().isEmpty()) {
            maintenance.setStatus("PENDING");
        } else {
            maintenance.setStatus(dto.getStatus());
        }

        // Step 3: Link the Resource
        maintenance.setResource(resource);

        return maintenanceRepo.save(maintenance);
    }

    // 3. UPDATE STATUS
    public Maintenance updateStatus(int id, String newStatus) {
        Maintenance m = maintenanceRepo.findById(id).orElse(null);
        if (m != null) {
            m.setStatus(newStatus);
            return maintenanceRepo.save(m);
        }
        return null;
    }

    // 4. GET BY BUILDING
    public List<Maintenance> getMaintenanceByBuilding(int buildingId) {
        return maintenanceRepo.findByBuildingId(buildingId);
    }

    // 5. DELETE
    public boolean deleteMaintenance(int id) {
        if (maintenanceRepo.existsById(id)) {
            maintenanceRepo.deleteById(id);
            return true;
        }
        return false;
    }

    // 6. UPDATE NOTES
    public Maintenance updateNotes(int id, String notes) {
        Maintenance m = maintenanceRepo.findById(id).orElse(null);
        if (m != null) {
            m.setNotes(notes);
            return maintenanceRepo.save(m);
        }
        return null;
    }
}