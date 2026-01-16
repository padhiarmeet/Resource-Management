package com.project.resource_management.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.resource_management.Model.ResourceType;
import com.project.resource_management.Repository.ResourceTypeRepo;

@Service
public class ResourceTypeService {

    @Autowired
    private ResourceTypeRepo resourceTypeRepo;

    public List<ResourceType> getAllResourceTypes() {
        return resourceTypeRepo.findAll();
    }

    public ResourceType getResourceTypeById(int id) {
        return resourceTypeRepo.findById(id).orElse(null);
    }

    public ResourceType addResourceType(ResourceType resourceType) {
        return resourceTypeRepo.save(resourceType);
    }

    public ResourceType updateResourceType(int id, ResourceType newData) {
        Optional<ResourceType> existingType = resourceTypeRepo.findById(id);

        if (existingType.isPresent()) {
            ResourceType typeToUpdate = existingType.get();

            typeToUpdate.setType_name(newData.getType_name());
            return resourceTypeRepo.save(typeToUpdate);
        } else {
            return null;
        }
    }

    public boolean deleteResourceType(int id) {

        try {
            if (resourceTypeRepo.existsById(id)) {
                resourceTypeRepo.deleteById(id);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            System.out.println("Something Wrong while deleting the ResourcesType - " + e);
            return false;
        }

    }
}