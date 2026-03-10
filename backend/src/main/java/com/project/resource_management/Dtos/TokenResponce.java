package com.project.resource_management.Dtos;

import com.project.resource_management.Model.Users;

public record TokenResponce(String accessToken, String refreshToken, long expiresIn, String tokenType, Users user) {

    public static TokenResponce of(String accessToken, String refreshToken, long expiresIn, Users user) {
        return new TokenResponce(accessToken, refreshToken, expiresIn, "Bearer", user);
    }
    
}
