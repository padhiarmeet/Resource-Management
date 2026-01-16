package com.project.resource_management.Services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.resource_management.Dtos.ShelfDTO;
import com.project.resource_management.Model.Cupboard;
import com.project.resource_management.Model.Shelf;
import com.project.resource_management.Repository.CupboardRepo;
import com.project.resource_management.Repository.ShelfRepo;

@Service
public class ShelfService {

    @Autowired
    private ShelfRepo shelfRepo;

    @Autowired
    private CupboardRepo cupboardRepo;

    // 1. GET ALL
    public List<Shelf> getAllShelves() {
        return shelfRepo.findAll();
    }

    // 2. GET BY CUPBOARD ID
    public List<Shelf> getShelvesByCupboardId(int cupboardId) {
        return shelfRepo.findByCupboard_Cupboard_id(cupboardId);
    }

    // 3. ADD SHELF
    public Shelf addShelf(ShelfDTO dto) {
        // Step 1: Find the Cupboard
        Cupboard cupboard = cupboardRepo.findById(dto.getCupboard_id())
            .orElseThrow(() -> new RuntimeException("Cupboard ID " + dto.getCupboard_id() + " not found"));

        // Step 2: Create the Shelf Object
        Shelf shelf = new Shelf();
        shelf.setShelf_number(dto.getShelf_number());
        shelf.setCapacity(dto.getCapacity());
        shelf.setDescription(dto.getDescription());
        
        // Step 3: Link them
        shelf.setCupboard(cupboard);

        return shelfRepo.save(shelf);
    }

    // 4. UPDATE SHELF
    public Shelf updateShelf(int id, ShelfDTO dto) {
        Shelf existing = shelfRepo.findById(id).orElse(null);
        
        if (existing != null) {
            existing.setShelf_number(dto.getShelf_number());
            existing.setCapacity(dto.getCapacity());
            existing.setDescription(dto.getDescription());
            return shelfRepo.save(existing);
        }
        return null;
    }

    // 5. DELETE
    public boolean deleteShelf(int id) {
        if (shelfRepo.existsById(id)) {
            shelfRepo.deleteById(id);
            return true;
        }
        return false;
    }
}