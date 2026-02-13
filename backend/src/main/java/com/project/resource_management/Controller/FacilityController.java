package com.project.resource_management.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.resource_management.Dtos.FacilityDTO;
import com.project.resource_management.Model.Facility;
import com.project.resource_management.Services.FacilityService;

@RestController
@CrossOrigin()
@RequestMapping("/api/facilities")
public class FacilityController {

    @Autowired
    private FacilityService facilityService;

    // 1. GET ALL
    @GetMapping("/")
    public ResponseEntity<List<Facility>> getAllFacilities() {
        return new ResponseEntity<>(facilityService.getAllFacilities(), HttpStatus.OK);
    }

    // 2. GET BY RESOURCE ID
    @GetMapping("/resource/{resourceId}")
    public ResponseEntity<List<Facility>> getFacilitiesByResource(@PathVariable int resourceId) {
        return new ResponseEntity<>(facilityService.getFacilitiesByResourceId(resourceId), HttpStatus.OK);
    }

    // 3. ADD FACILITY
    @PostMapping("/")
    public ResponseEntity<?> addFacility(@RequestBody FacilityDTO request) {
        try {
            Facility newFacility = facilityService.addFacility(
                    request.getFacility_name(),
                    request.getDetails(),
                    request.getResource_id());
            return new ResponseEntity<>(newFacility, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // 4. UPDATE FACILITY
    @PutMapping("/{id}")
    public ResponseEntity<?> updateFacility(@PathVariable int id, @RequestBody FacilityDTO request) {
        Facility updated = facilityService.updateFacility(
                id,
                request.getFacility_name(),
                request.getDetails());

        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Facility ID " + id + " not found", HttpStatus.NOT_FOUND);
        }
    }

    // 5. DELETE FACILITY
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFacility(@PathVariable int id) {
        boolean isDeleted = facilityService.deleteFacility(id);

        if (isDeleted) {
            return new ResponseEntity<>("Facility deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Facility ID " + id + " not found", HttpStatus.NOT_FOUND);
        }
    }
}