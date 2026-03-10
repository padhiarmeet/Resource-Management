package com.project.resource_management.Controller;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.resource_management.Dtos.LoginRequest;
import com.project.resource_management.Dtos.TokenResponce;
import com.project.resource_management.Model.RefreshToken;
import com.project.resource_management.Model.Role;
import com.project.resource_management.Model.Users;
import com.project.resource_management.Repository.RefreshTokenRepo;
import com.project.resource_management.Repository.RoleRepo;
import com.project.resource_management.Repository.UsersRepo;
import com.project.resource_management.Security.JWTService;
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

    @Autowired
    private JWTService jwtService;

    private final AuthenticationManager authenticationManager;

    private final PasswordEncoder passwordEncoder;

    private final RefreshTokenRepo refreshTokenRepo;

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



    @PostMapping("/login")
    public ResponseEntity<TokenResponce> loginUser(@RequestBody LoginRequest req) {
        Authentication authenticate = authenticate(req);
        Users user = usersRepo.findByEmail(req.email()).orElseThrow(() -> new BadCredentialsException("\"Invalid Username for Password : \" + e.getMessage()"));

        if(!user.isEnabled()) {
            throw new BadCredentialsException("Your account has been disabled.");
        }

        String jti = UUID.randomUUID().toString();
        var refreshTokenObject = RefreshToken.builder()
        .jti(jti)
        .user(user)
        .createdAt(Instant.now())
        .expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTtlSeconds()))
        .revoked(false)
        .build(); 

        // RefreshToken will be saved in database ! 
        refreshTokenRepo.save(refreshTokenObject);

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user, refreshTokenObject.getJti());

        TokenResponce tokenResponce =  TokenResponce.of(accessToken,refreshToken,jwtService.getAccessTtlSeconds(),user);

        return ResponseEntity.ok(tokenResponce);
    }   

    private Authentication authenticate(LoginRequest req) {
        try{
            return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        }
        catch(Exception e) {
            throw new BadCredentialsException("Invalid Username for Password : " + e.getMessage());
        }
    }
}


// try {
//             Optional<Users> userOpt = usersRepo.findByEmail(req.email);

//             if (userOpt.isEmpty()) {
//                 return new ResponseEntity<>("User not found. Please register first.",
//                         HttpStatus.NOT_FOUND);
//             }

        //     Users user = userOpt.get();

        //     // Use passwordEncoder.matches() for proper bcrypt comparison
        //     if (!passwordEncoder.matches(req.password, user.getPassword())) {
        //         return new ResponseEntity<>("Invalid password!", HttpStatus.UNAUTHORIZED);
        //     }

        //     if (!user.isEnabled()) {
        //         return new ResponseEntity<>("Your account has been disabled. Please contact admin.",
        //                 HttpStatus.FORBIDDEN);
        //     }

        //     // Generate access and refresh tokens
        //     String accessToken = jwtService.generateAccessToken(user);
        //     String refreshToken = jwtService.generateRefreshToken(user, java.util.UUID.randomUUID().toString());

        //     // Don't send password back
        //     user.setPassword(null);
            
        //     return new ResponseEntity<>(new LoginResponse(accessToken, refreshToken, user), HttpStatus.OK);
        // } catch (Exception e) {
        //     return new ResponseEntity<>("Login failed: " + e.getMessage(),
        //             HttpStatus.INTERNAL_SERVER_ERROR);
        // }
