package com.project.resource_management.Services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.resource_management.Dtos.CupboardDTO;
import com.project.resource_management.Model.Cupboard;
import com.project.resource_management.Model.Resources;
import com.project.resource_management.Repository.CupboardRepo;
import com.project.resource_management.Repository.ResourcesRepo;

@Service
public class CupboardService {

    @Autowired
    private CupboardRepo cupboardRepo;

    @Autowired
    private ResourcesRepo resourceRepo;

    // 1. GET ALL
    public List<Cupboard> getAllCupboards() {
        return cupboardRepo.findAll();
    }

    // 2. GET BY RESOURCE (e.g., Show all cupboards in Lab 1)
    public List<Cupboard> getCupboardsByResourceId(int resourceId) {
        return cupboardRepo.findByResource_Resource_id(resourceId);
    }

    // 3. CREATE CUPBOARD
    public Cupboard addCupboard(CupboardDTO dto) {
        Resources resource = resourceRepo.findById(dto.getResource_id())
            .orElseThrow(() -> new RuntimeException("Resource ID " + dto.getResource_id() + " not found"));

       
        Cupboard cupboard = new Cupboard();
        cupboard.setCupboard_name(dto.getCupboard_name());
        cupboard.setTotal_shelves(dto.getTotal_shelves());
        
       
        cupboard.setResource(resource);

        return cupboardRepo.save(cupboard);
    }

    // 4. UPDATE CUPBOARD
    public Cupboard updateCupboard(int id, CupboardDTO dto) {
        Cupboard existing = cupboardRepo.findById(id).orElse(null);
        
        if (existing != null) {
            existing.setCupboard_name(dto.getCupboard_name());
            existing.setTotal_shelves(dto.getTotal_shelves());
            // Note: We usually don't move cupboards between rooms in an update, 
            // but if you need to, you can update the resource here too.
            return cupboardRepo.save(existing);
        }
        return null;
    }

    // 5. DELETE
    public boolean deleteCupboard(int id) {
        if (cupboardRepo.existsById(id)) {
            cupboardRepo.deleteById(id);
            return true;
        }
        return false;
    }
}