package com.project.resource_management.Controller;

import java.time.Instant;
import java.util.Arrays;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.resource_management.Dtos.LoginRequest;
import com.project.resource_management.Dtos.RefreshTokenRequest;
import com.project.resource_management.Dtos.TokenResponce;
import com.project.resource_management.Model.RefreshToken;
import com.project.resource_management.Model.Role;
import com.project.resource_management.Model.Users;
import com.project.resource_management.Repository.RefreshTokenRepo;
import com.project.resource_management.Repository.RoleRepo;
import com.project.resource_management.Repository.UsersRepo;
import com.project.resource_management.Security.CookieService;
import com.project.resource_management.Security.JWTService;
import com.project.resource_management.Services.UsersService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

    private final CookieService cookieService;

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

            // This is for returning the uesr that saved but we will not send the pasword so
            // we will first set password to null and then send the object!

            Optional<Users> saved = usersRepo.findByEmail(req.email);
            if (saved.isPresent()) {
                Users u = saved.get();
                u.setPassword(null);

                return new ResponseEntity<>(u, HttpStatus.CREATED);
            }

            return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Registration failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponce> refreshToken(
            @RequestBody(required = false) RefreshTokenRequest body,
            HttpServletResponse response,
            HttpServletRequest request) {

        String refreshToken = readrefreshTokenFromRequest(body, request)
                .orElseThrow(() -> new BadCredentialsException("Refresh token is required."));

        if (!jwtService.isRefreshToken(refreshToken)) {
            throw new BadCredentialsException("Invalid refresh token type");
        }

        String jti = jwtService.getJti(refreshToken);
        int userId = jwtService.getUserId(refreshToken);
        RefreshToken storedRefreshToken = refreshTokenRepo.findByJti(jti)
                .orElseThrow(() -> new BadCredentialsException("Invalid Refresh token"));

        if (storedRefreshToken.isRevoked()) {
            throw new BadCredentialsException("Refresh token has been revoked");
        }
        if (storedRefreshToken.getExpiresAt().isBefore(Instant.now())) {
            throw new BadCredentialsException("Refresh token has expired");
        }
        if (storedRefreshToken.getUser().getUserId() != userId) {
            throw new BadCredentialsException("Refresh token does not belong to the expected user");
        }

        storedRefreshToken.setRevoked(true);

        String newJti = UUID.randomUUID().toString();
        storedRefreshToken.setReplacedBy(newJti);
        refreshTokenRepo.save(storedRefreshToken);

        Users user = storedRefreshToken.getUser();

        var newRefreshTokenObject = RefreshToken.builder()
                .jti(newJti)
                .user(user)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTtlSeconds()))
                .revoked(false)
                .build();

        refreshTokenRepo.save(newRefreshTokenObject);

        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user, newRefreshTokenObject.getJti());

        cookieService.attachRefreshCookie(response, newRefreshToken, (int) jwtService.getRefreshTtlSeconds());
        cookieService.addNoStoreHeaders(response);

        return ResponseEntity
                .ok(TokenResponce.of(newAccessToken, newRefreshToken, jwtService.getAccessTtlSeconds(), user));

    }

    private Optional<String> readrefreshTokenFromRequest(RefreshTokenRequest body, HttpServletRequest request) {
        if (request.getCookies() != null) {
            Optional<String> fromCookie = Arrays.stream(request.getCookies())
                    .filter(cookie -> cookie.getName().equals(cookieService.getRefreshTokenCookieName()))
                    .map(Cookie::getValue)
                    .filter(v -> !v.isBlank())
                    .findFirst();

            if (fromCookie.isPresent()) {
                return fromCookie;
            }

            // 2. Refresh token passed in body
            if (body != null && body.refreshToken() != null && !body.refreshToken().isBlank()) {
                return Optional.of(body.refreshToken());
            }

            // 3. Refresh token passed in Header
            String header = request.getHeader("X-Refresh-Token");
            if (header != null && !header.isBlank()) {
                return Optional.of(header);
            }

            // 4. Authentication in bearer
            String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
            if (authHeader != null && authHeader.regionMatches(true, 0, "Bearer", 0, 6)) {
                String token = authHeader.substring(7).trim();
                if (!token.isEmpty()) {
                    try {

                        if (jwtService.isRefreshToken(token)) {
                            return Optional.of(token);
                        }
                    } catch (Exception ignored) {
                        return Optional.empty();
                    }
                }
            }
        }
        return Optional.empty();
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponce> loginUser(@RequestBody LoginRequest req, HttpServletResponse response) {
        Authentication authenticate = authenticate(req);
        Users user = usersRepo.findByEmail(req.email()).orElseThrow(
                () -> new BadCredentialsException("\"Invalid Username for Password : \" + e.getMessage()"));

        if (!user.isEnabled()) {
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

        cookieService.attachRefreshCookie(response, refreshToken, (int) jwtService.getRefreshTtlSeconds());
        cookieService.addNoStoreHeaders(response);

        TokenResponce tokenResponce = TokenResponce.of(accessToken, refreshToken, jwtService.getAccessTtlSeconds(),
                user);

        return ResponseEntity.ok(tokenResponce);
    }

    private Authentication authenticate(LoginRequest req) {
        try {
            return authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid Username for Password : " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        readrefreshTokenFromRequest(null, request).ifPresent(token -> {
            try{
                if(jwtService.isRefreshToken(token)) {
                    String jti = jwtService.getJti(token);
                    refreshTokenRepo.findByJti(jti).ifPresent(rt -> {
                        rt.setRevoked(true);
                        refreshTokenRepo.save(rt);
                    });
                } 
            }
            catch(Exception e){

            }
        });
        cookieService.clearRefreshCookie(response);
        cookieService.addNoStoreHeaders(response);
        SecurityContextHolder.clearContext();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
