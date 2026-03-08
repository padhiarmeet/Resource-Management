package com.project.resource_management.Security;

import java.nio.charset.StandardCharsets;
import java.sql.Date;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.project.resource_management.Model.Users;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JWTService {

    private final SecretKey key;
    private final long accessTtlSeconds;
    private final long refreshTtlSeconds;
    private final String issuer;

    public JWTService(
            @Value("${JWT_SECRET}") String secret,
            @Value("${JWT_ACCESS_TTL_SECONDS}") long accessTtlSeconds,
            @Value("${JWT_REFRESH_TTL_SECONDS}") long refreshTtlSeconds,
            @Value("${JWT_ISSUER}") String issuer) {

        if(secret == null || secret.length() < 64) {
            throw new IllegalArgumentException("Invalid secret.");
        }

        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTtlSeconds = accessTtlSeconds;
        this.refreshTtlSeconds = refreshTtlSeconds;
        this.issuer = issuer;
    }

    public String generateAccessToken(Users user) {
        Instant now = Instant.now();

        List<String> roles = user.getRoles() == null? List.of(): user.getRoles().stream()
                .map(role -> role.getRoleName())
                .toList();

        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(String.valueOf(user.getUserId()))
                .issuer(issuer)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(accessTtlSeconds)))
                .claims(Map.of(
                    "email", user.getEmail(),
                    "roles", roles,
                    "typ", "access"
                ))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }


    public String generateRefreshToken(Users user, String jti) {
        Instant now = Instant.now();

        List<String> roles = user.getRoles() == null? List.of(): user.getRoles().stream()
                .map(role -> role.getRoleName())
                .toList();

        return Jwts.builder()
                .id(jti)
                .subject(String.valueOf(user.getUserId()))
                .issuer(issuer)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(refreshTtlSeconds)))
                .claims(Map.of("typ", "refresh"))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}
