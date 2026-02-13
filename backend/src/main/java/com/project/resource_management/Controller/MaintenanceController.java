package com.project.resource_management.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.resource_management.Dtos.MaintenanceDTO;
import com.project.resource_management.Model.Maintenance;
import com.project.resource_management.Services.MaintenanceService;

@RestController
@CrossOrigin()
@RequestMapping("api/maintenance")
public class MaintenanceController {

    @Autowired
    private MaintenanceService maintenanceService;

    // 1. GET ALL
    @GetMapping("/")
    public ResponseEntity<List<Maintenance>> getAllMaintenance() {
        return new ResponseEntity<>(maintenanceService.getAllMaintenance(), HttpStatus.OK);
    }

    // 2. CREATE REPORT (Matches your DTO)
    @PostMapping("/")
    public ResponseEntity<?> createReport(@RequestBody MaintenanceDTO dto) {
        try {
            Maintenance created = maintenanceService.createMaintenance(dto);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (Exception e) {
            // Returns error if Resource ID not found
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // 3. UPDATE STATUS
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable int id, @RequestParam String status) {
        Maintenance updated = maintenanceService.updateStatus(id, status);

        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Maintenance ID " + id + " not found", HttpStatus.NOT_FOUND);
        }
    }

    // 4. DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMaintenance(@PathVariable int id) {
        boolean isDeleted = maintenanceService.deleteMaintenance(id);

        if (isDeleted) {
            return new ResponseEntity<>("Maintenance record deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Maintenance ID " + id + " not found", HttpStatus.NOT_FOUND);
        }
    }

    // 5. UPDATE NOTES
    @PutMapping("/{id}/notes")
    public ResponseEntity<?> updateNotes(@PathVariable int id, @RequestBody java.util.Map<String, String> body) {
        Maintenance updated = maintenanceService.updateNotes(id, body.getOrDefault("notes", ""));
        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        }
        return new ResponseEntity<>("Maintenance ID " + id + " not found", HttpStatus.NOT_FOUND);
    }

    // 6. GET BY BUILDING
    @GetMapping("/building/{buildingId}")
    public ResponseEntity<List<Maintenance>> getByBuilding(@PathVariable int buildingId) {
        return new ResponseEntity<>(maintenanceService.getMaintenanceByBuilding(buildingId), HttpStatus.OK);
    }
}