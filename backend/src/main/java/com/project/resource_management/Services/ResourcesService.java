package com.project.resource_management.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.resource_management.Model.Building;
import com.project.resource_management.Model.ResourceType;
import com.project.resource_management.Model.Resources;
import com.project.resource_management.Repository.BuildingsRepo;
import com.project.resource_management.Repository.ResourceTypeRepo;
import com.project.resource_management.Repository.ResourcesRepo;

@Service
public class ResourcesService {
    @Autowired
    ResourcesRepo resourceRepo;

    @Autowired
    BuildingsRepo buildingRepo;

    @Autowired
    ResourceTypeRepo resourceTypeRepo;

    public List<Resources> getAllResources() {
        return resourceRepo.findAll();      
    }

    public Resources getResourcesById(int id) {
        return resourceRepo.findById(id).orElse(null);
    }

    public Resources addResources(Resources resources, int buildingId, int typeId) {

        Building building = buildingRepo.findById(buildingId)
            .orElseThrow(() -> new RuntimeException("Building ID " + buildingId + " not found"));

        ResourceType type = resourceTypeRepo.findById(typeId)
            .orElseThrow(() -> new RuntimeException("Resource Type ID " + typeId + " not found"));

        resources.setBuilding(building);
        resources.setResourceType(type);

        resourceRepo.save(resources);   
        return resources;
    }

    public boolean deleteResourceById(int id) {
        try{
            resourceRepo.deleteById(id);
            return true; 
        }
        catch(Exception e){
            System.out.println("Something Wrong while deleting the Resources - " + e);
            return false;
        }
    }

    public Resources updateResource(int resourceId,int buildingId, int resourceTypeId, Resources resource) {
    
        try{
            
            Optional<Resources> existingData = resourceRepo.findById(resourceId);

            if(existingData.isPresent()){
                Resources resourceToUpdate = existingData.get();

                resourceToUpdate.setResource_name(resource.getResource_name());
                resourceToUpdate.setDescription(resource.getDescription());
                resourceToUpdate.setFloor_number(resource.getFloor_number());

                if (resource.getBuilding() != null) {
                resourceToUpdate.setBuilding(resource.getBuilding());
                }
                if (resource.getResourceType() != null) {
                resourceToUpdate.setResourceType(resource.getResourceType());
                }

                Building building = new Building();
                building.setBuilding_id(buildingId); 
                resourceToUpdate.setBuilding(building);

                ResourceType type = new ResourceType();
                type.setResource_type_id(resourceTypeId); 
                resource.setResourceType(type);

                return resourceRepo.save(resourceToUpdate);
            }
            else return null;

        }
        catch(Exception e){
            System.out.println("Something is Wrong while updating the Resources - " + e);
            return null;
        }
    }
}
