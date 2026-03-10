package com.project.resource_management.Security;

import java.io.IOException;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.project.resource_management.Repository.UsersRepo;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JWTService jwtService;

    private final UsersRepo usersRepo;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);

            if (!jwtService.isAccessToken(token)) {
                filterChain.doFilter(request, response);
                return;
            }

            try {
                Jws<Claims> claims = jwtService.parse(token);
                Claims payload = claims.getPayload();
                String userId = payload.getSubject();
                Integer userIdInt = Integer.parseInt(userId);

                usersRepo.findById(userIdInt).ifPresent(user -> {

                    if (user.isEnabled()) {
                        List<GrantedAuthority> authorities = user.getRoles() == null ? List.of()
                                : user.getRoles().stream()
                                        .map(role -> new SimpleGrantedAuthority(role.getRoleName()))
                                        .collect(Collectors.toList());

                        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                user.getEmail(), null, authorities);

                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        if (SecurityContextHolder.getContext().getAuthentication() == null) {
                            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                        }

                    }
                });

            }
            catch(ExpiredJwtException e){
                request.setAttribute("error", "Token Expired");
            }
            catch (Exception e) {
                request.setAttribute("error", "Invalid Token"); 
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
      return request.getRequestURI().startsWith("/api/auth/");
   }

}
