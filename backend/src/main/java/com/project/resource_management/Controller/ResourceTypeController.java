package com.project.resource_management.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.resource_management.Model.ResourceType;
import com.project.resource_management.Services.ResourceTypeService;

@RestController
@CrossOrigin() 
@RequestMapping("/api/resource-types")
public class ResourceTypeController {

    @Autowired
    private ResourceTypeService resourceTypeService;
   
    @GetMapping("/")
    public ResponseEntity<List<ResourceType>> getAllResourceTypes() {
        return new ResponseEntity<>(resourceTypeService.getAllResourceTypes(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getResourceTypeById(@PathVariable int id) {
        ResourceType type = resourceTypeService.getResourceTypeById(id);
        if (type != null) {
            return new ResponseEntity<>(type, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Resource Type ID " + id + " not found", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<?> addResourceType(@RequestBody ResourceType resourceType) {
        try {
            ResourceType newType = resourceTypeService.addResourceType(resourceType);
            return new ResponseEntity<>(newType, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating type: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateResourceType(@PathVariable int id, @RequestBody ResourceType resourceType) {
        ResourceType updatedType = resourceTypeService.updateResourceType(id, resourceType);
        
        if (updatedType != null) {
            return new ResponseEntity<>(updatedType, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cannot update: Type ID " + id + " not found", HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResourceType(@PathVariable int id) {
        boolean isDeleted = resourceTypeService.deleteResourceType(id);
        
        if (isDeleted) {
            return new ResponseEntity<>("Resource Type deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cannot delete: Type ID " + id + " not found", HttpStatus.NOT_FOUND);
        }
    }
}