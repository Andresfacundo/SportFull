package com.example.sport_full.models;

import jakarta.persistence.*;
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

    public LocalDateTime getExpiryDate() {
        return expiryDate;  // Ahora devuelve el valor real de expiryDate
    }

    public Long getUserId() {
        return userId;  // Ahora devuelve el valor real de userId
    }

    // Getters y setters adicionales si es necesario

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }
}
