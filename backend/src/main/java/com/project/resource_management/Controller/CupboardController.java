package com.project.resource_management.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.resource_management.Dtos.CupboardDTO;
import com.project.resource_management.Model.Cupboard;
import com.project.resource_management.Services.CupboardService;

@RestController
@CrossOrigin()
@RequestMapping("api/cupboards")
public class CupboardController {

    @Autowired
    private CupboardService cupboardService;

    // 1. GET ALL
    @GetMapping("/")
    public ResponseEntity<List<Cupboard>> getAllCupboards() {
        return new ResponseEntity<>(cupboardService.getAllCupboards(), HttpStatus.OK);
    }

    // 2. GET BY RESOURCE ID
    @GetMapping("/resource/{resourceId}")
    public ResponseEntity<List<Cupboard>> getCupboardsByResource(@PathVariable int resourceId) {
        return new ResponseEntity<>(cupboardService.getCupboardsByResourceId(resourceId), HttpStatus.OK);
    }

    // 3. ADD (Create)
    @PostMapping("/")
    public ResponseEntity<?> addCupboard(@RequestBody CupboardDTO dto) {
        try {
            Cupboard newCupboard = cupboardService.addCupboard(dto);
            return new ResponseEntity<>(newCupboard, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // 4. UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCupboard(@PathVariable int id, @RequestBody CupboardDTO dto) {
        Cupboard updated = cupboardService.updateCupboard(id, dto);
        
        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cupboard ID " + id + " not found", HttpStatus.NOT_FOUND);
        }
    }

    // 5. DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCupboard(@PathVariable int id) {
        boolean isDeleted = cupboardService.deleteCupboard(id);
        
        if (isDeleted) {
            return new ResponseEntity<>("Cupboard deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cupboard ID " + id + " not found", HttpStatus.NOT_FOUND);
        }
    }
}