package com.project.resource_management.Services;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.resource_management.Model.Users;
import com.project.resource_management.Repository.UsersRepo;

@Service
public class UsersService {

    @Autowired
    private UsersRepo repo;

    public List<Users> getAllUsers() {
        return repo.findAll();
    }

    public Users getUserBYId(int id) {
        return repo.findById(id).orElse(new Users());
    }

    public void addUser(Users user) {
        try {
            repo.save(user);
        }
        catch (Exception e) {
            System.out.println("Error while adding User - " + e);
        }
    }

    public boolean deleteUserById(int id) {
        try {
            if (repo.existsById(id)) {
                repo.deleteById(id);
                return true;
            } 
            else {
                return false;
            }
        } 
        catch (Exception e) {

            System.out.println("Error while Deleting User - " + e);
            return false;
        }
    }

    public Users updateUser(Users user, int id) throws IOException {

        Optional<Users> existingUserOpt = repo.findById(id);

        if (existingUserOpt.isPresent()) {
            Users userToUpdate = existingUserOpt.get();

            
            userToUpdate.setName(user.getName());
            userToUpdate.setRole(user.getRole());

            
            if (!userToUpdate.getEmail().equals(user.getEmail())) {
                 if (repo.findByEmail(user.getEmail()).isPresent()) {
                     throw new RuntimeException("New email is already in use!");
                 }
                 userToUpdate.setEmail(user.getEmail());
            }
            
            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                userToUpdate.setPassword(user.getPassword());
            }

            return repo.save(userToUpdate);
        } else {
            return null;
        }
    }
}
