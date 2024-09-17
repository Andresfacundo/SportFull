package com.example.sport_full.models;

import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;
    private Long userId;
    private LocalDateTime expiryDate;

    // Constructores, getters y setters

    public PasswordResetToken() {
    }

    public PasswordResetToken(String token, Long userId, LocalDateTime expiryDate) {
        this.token = token;
        this.userId = userId;
        this.expiryDate = expiryDate;
    }

    public Instant getExpiryDate() {
        return null;
    }

    public Long getUserId() {
        return 0L;
    }

    // Getters y setters
}
