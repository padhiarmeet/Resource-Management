package com.project.resource_management.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.resource_management.Dtos.ResourceDto;
import com.project.resource_management.Model.Resources;
import com.project.resource_management.Services.ResourcesService;

@RestController
@CrossOrigin
@RequestMapping("api/resources")
public class ResourcesController {

    @Autowired
    private ResourcesService resourcesService;

    @GetMapping("/")
    public ResponseEntity<List<Resources>> getAllResources() {
        return new ResponseEntity<>(resourcesService.getAllResources(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getResourcesById(@PathVariable int id) {
        try {
            return new ResponseEntity<>(resourcesService.getResourcesById(id), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Resource ID " + id + " not found !", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/")
    public ResponseEntity<?> addResources(@RequestBody ResourceDto resourceDTO) {
        try {
            Resources basicInfo = new Resources();
            basicInfo.setResource_name(resourceDTO.getResource_name());
            basicInfo.setDescription(resourceDTO.getDescription());
            basicInfo.setFloor_number(resourceDTO.getFloor_number());

            Resources savedResource = resourcesService.addResources(
                    basicInfo,
                    resourceDTO.getBuilding_id(),
                    resourceDTO.getResource_type_id()
                );

            return new ResponseEntity<>(savedResource, HttpStatus.CREATED);
        } 
        catch (Exception e) {
            return new ResponseEntity<>("Error creating Resource - " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateResource(@PathVariable int id, @RequestBody ResourceDto resourceDTO) {

        Resources basicInfo = new Resources();
            basicInfo.setResource_name(resourceDTO.getResource_name());
            basicInfo.setDescription(resourceDTO.getDescription());
            basicInfo.setFloor_number(resourceDTO.getFloor_number());

        Resources updatedResource = resourcesService.updateResource(id,resourceDTO.getBuilding_id(), resourceDTO.getResource_type_id(), basicInfo);

        if (updatedResource != null) {
            return new ResponseEntity<>(updatedResource, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cannot update: Resource ID " + id + " not found", HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResourceById(@PathVariable int id) {
        boolean isDeleted = resourcesService.deleteResourceById(id);

        if (isDeleted) {
            return new ResponseEntity<>(resourcesService.deleteResourceById(id), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cannot delete that resouece with id : " + id + "Not found",
                    HttpStatus.NOT_FOUND);
        }
    }

}
