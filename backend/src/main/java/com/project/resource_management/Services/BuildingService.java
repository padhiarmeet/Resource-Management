package com.project.resource_management.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.resource_management.Model.Building;
import com.project.resource_management.Repository.BuildingsRepo;

@Service
public class BuildingService {

    @Autowired
    private BuildingsRepo buildingsRepo;

    public List<Building> getAllBuildings() {
        return buildingsRepo.findAll();
    }

    
    public Building getBuildingById(int id) {
        
        return buildingsRepo.findById(id).orElse(null);
    }

    
    public Building addBuilding(Building building) {
        return buildingsRepo.save(building);
    }

   
    public boolean deleteBuilding(int id) {
        if (buildingsRepo.existsById(id)) {
            buildingsRepo.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    
    public Building updateBuilding(int id, Building newData) {
        
        Optional<Building> existingData = buildingsRepo.findById(id);

        if (existingData.isPresent()) {
            Building buildingToUpdate = existingData.get();
            
            buildingToUpdate.setBuilding_name(newData.getBuilding_name());
            buildingToUpdate.setBuilding_number(newData.getBuilding_number());
            buildingToUpdate.setTotal_floors(newData.getTotal_floors());

            return buildingsRepo.save(buildingToUpdate);

        } 
        else {
            return null;
        }
    }
}
