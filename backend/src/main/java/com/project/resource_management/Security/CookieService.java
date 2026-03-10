package com.project.resource_management.Security;

import org.springframework.stereotype.Service;

@Service
public class CookieService {
    
    private final String refreshTokenCookieName;
    private final boolean cookieHttpOnly;
    private final boolean cookieSecure;
    private final String cookieDomain;
    private final String cookieSameSite;
}
