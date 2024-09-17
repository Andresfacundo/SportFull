package com.example.sport_full.utils;

import java.security.SecureRandom;
import java.util.Base64;

public class TokenGenerator {
    private static final SecureRandom random = new SecureRandom();

    public static String generateToken() {
        byte[] tokenBytes = new byte[24]; // Tamaño del token
        random.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }
}
