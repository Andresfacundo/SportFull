package com.example.sport_full.utils;

import java.util.UUID;

public class TokenGenerator {

    // Método para generar un token único
    public static String generateToken() {
        return UUID.randomUUID().toString();
    }
}
