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

import com.project.resource_management.Model.Building;
import com.project.resource_management.Services.BuildingService;

@RestController
@CrossOrigin
@RequestMapping("api/buildings")
public class BuildingController {
    
    @Autowired
    private BuildingService buildingService;

    @GetMapping("/")
    public ResponseEntity<List<Building>> getAllBuildings() {
        return new ResponseEntity<>(buildingService.getAllBuildings(),HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBuildingById(@PathVariable int id){
        Building building = buildingService.getBuildingById(id);

        if(building != null){
            return new ResponseEntity<>(building,HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>("Building id" + id + " not found !", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/")
    public ResponseEntity<?> addBuilding(@RequestBody Building dataFromBody) {
        try{
            Building building = buildingService.addBuilding(dataFromBody);


            return new ResponseEntity<>(building,HttpStatus.CREATED);
        }
        catch(Exception e){
            return new ResponseEntity<>("Error creating building - " + e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBuilding(@PathVariable int id) {
        boolean isDeleted = buildingService.deleteBuilding(id);

        if(isDeleted) {
            return new ResponseEntity<>(buildingService.deleteBuilding(id),HttpStatus.OK);   
        }
        else{
            return new ResponseEntity<>("Cannot delete Building having id " + id + "Not found" ,HttpStatus.NOT_FOUND);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBuilding(@PathVariable int id, @RequestBody Building building) {
        Building updatedBuilding = buildingService.updateBuilding(id, building);

        if(updatedBuilding != null) {
            return new ResponseEntity<>(updatedBuilding,HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>("Cannot update Building having id : " + id + " not found !",HttpStatus.NOT_FOUND);
        }
    }
}
