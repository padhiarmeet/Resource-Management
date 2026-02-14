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

import com.project.resource_management.Model.Users;
import com.project.resource_management.Services.UsersService;

@RestController
@CrossOrigin

@RequestMapping("api/users")
public class UsersController {

    @Autowired
    private UsersService service;

    @GetMapping("/")
    public ResponseEntity<List<Users>> getAllUsers() {
        return new ResponseEntity<>(service.getAllUsers(), HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<?> addUser(@RequestBody Users user) {
        try {
            service.addUser(user);
            return new ResponseEntity<>("User added successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error adding user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@RequestBody Users user, @PathVariable int id) {
        try {
            Users updatedUser = service.updateUser(user, id);
            if (updatedUser != null) {
                return new ResponseEntity<>(updatedUser, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id) {
        if (service.deleteUserById(id)) {
            return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }
}
