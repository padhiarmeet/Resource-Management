package com.project.resource_management.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.resource_management.Dtos.ShelfDTO;
import com.project.resource_management.Model.Shelf;
import com.project.resource_management.Services.ShelfService;

@RestController
@CrossOrigin()
@RequestMapping("/api/shelves")
public class ShelfController {

    @Autowired
    private ShelfService shelfService;

    // 1. GET ALL
    @GetMapping("/")
    public ResponseEntity<List<Shelf>> getAllShelves() {
        return new ResponseEntity<>(shelfService.getAllShelves(), HttpStatus.OK);
    }

    // 2. GET BY CUPBOARD ID
    @GetMapping("/cupboard/{cupboardId}")
    public ResponseEntity<List<Shelf>> getShelvesByCupboard(@PathVariable int cupboardId) {
        return new ResponseEntity<>(shelfService.getShelvesByCupboardId(cupboardId), HttpStatus.OK);
    }

    // 3. CREATE
    @PostMapping("/")
    public ResponseEntity<?> addShelf(@RequestBody ShelfDTO dto) {
        try {
            Shelf newShelf = shelfService.addShelf(dto);
            return new ResponseEntity<>(newShelf, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // 4. UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateShelf(@PathVariable int id, @RequestBody ShelfDTO dto) {
        Shelf updated = shelfService.updateShelf(id, dto);
        
        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Shelf ID " + id + " not found", HttpStatus.NOT_FOUND);
        }
    }

    // 5. DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteShelf(@PathVariable int id) {
        boolean isDeleted = shelfService.deleteShelf(id);
        
        if (isDeleted) {
            return new ResponseEntity<>("Shelf deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Shelf ID " + id + " not found", HttpStatus.NOT_FOUND);
        }
    }
}