package com.project.resource_management.Controller;

import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.resource_management.Model.Role;
import com.project.resource_management.Model.Users;
import com.project.resource_management.Repository.RoleRepo;
import com.project.resource_management.Repository.UsersRepo;
import com.project.resource_management.Services.UsersService;

import lombok.AllArgsConstructor;

@RestController
@CrossOrigin
@AllArgsConstructor
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    private UsersService usersService;

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private RoleRepo roleRepo;

    private final PasswordEncoder passwordEncoder;

    // Register
    public static class RegisterRequest {
        public String name;
        public String email;
        public String password;
        public String role; // e.g. "ADMIN", "STUDENT", "FACULTY", "MAINTENANCE"
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest req) {
        try {
            // Check if email already exists
            Optional<Users> existing = usersRepo.findByEmail(req.email);
            if (existing.isPresent()) {
                return new ResponseEntity<>("Email already registered!", HttpStatus.CONFLICT);
            }

            // Resolve role from roles table (default to STUDENT)
            String roleName = (req.role != null ? req.role.toUpperCase() : "STUDENT");
            Optional<Role> roleOpt = roleRepo.findByRoleName(roleName);
            if (roleOpt.isEmpty()) {
                return new ResponseEntity<>("Role '" + roleName + "' not found.", HttpStatus.BAD_REQUEST);
            }
 
            Users user = new Users();
            user.setName(req.name);
            user.setEmail(req.email);
            user.setPassword(passwordEncoder.encode(req.password));
            // user.setPassword(req.password);
            user.setEnabled(true);
            user.setRoles(Set.of(roleOpt.get()));

            usersService.addUser(user);

            // This is for returning the uesr that saved but we will not send the pasword so we will first set password to null and then send the object!

            Optional<Users> saved = usersRepo.findByEmail(req.email);
            if (saved.isPresent()) {
                Users u = saved.get();
                u.setPassword(null);

                return new ResponseEntity<>(u, HttpStatus.CREATED);
            }

            return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>("Registration failed: " + e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Login
    public static class LoginRequest {
        public String email;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest req) {
        try {
            Optional<Users> userOpt = usersRepo.findByEmail(req.email);

            if (userOpt.isEmpty()) {
                return new ResponseEntity<>("User not found. Please register first.",
                        HttpStatus.NOT_FOUND);
            }

            Users user = userOpt.get();

            if (!user.getPassword().equals(req.password)) {
                return new ResponseEntity<>("Invalid password!", HttpStatus.UNAUTHORIZED);
            }

            if (!user.isEnabled()) {
                return new ResponseEntity<>("Your account has been disabled. Please contact admin.",
                        HttpStatus.FORBIDDEN);
            }

            // Don't send password back
            user.setPassword(null);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Login failed: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
