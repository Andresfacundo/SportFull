package com.example.sport_full.controllers;

import com.example.sport_full.Services.EmailService;
import com.example.sport_full.models.PasswordResetToken;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.IUserRepository;
import com.example.sport_full.repositories.TokenRepository;
import com.example.sport_full.utils.TokenGenerator;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/password")
public class PasswordResetController {

    private final EmailService emailService;
    private final TokenRepository tokenRepository;
    private final IUserRepository userRepository;

    public PasswordResetController(EmailService emailService, TokenRepository tokenRepository, IUserRepository userRepository) {
        this.emailService = emailService;
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/reset")
    public String processPasswordResetRequest(@RequestParam String email) {
        // Verificar si el usuario existe
        Optional<UserModels> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return "El correo no está registrado.";
        }

        // Obtener el usuario
        UserModels user = optionalUser.get();

        // Generar token y guardarlo
        String token = TokenGenerator.generateToken();
        PasswordResetToken resetToken = new PasswordResetToken(token, user.getId(), LocalDateTime.now().plusMinutes(30));
        tokenRepository.save(resetToken);

        // Generar el enlace de restablecimiento
        String resetLink = "http://localhost:8080/reset-password?token=" + token;

        // Enviar el correo
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);

        return "Correo de recuperación enviado.";
    }

    @PutMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        // Verificar si el token es válido
        PasswordResetToken resetToken = tokenRepository.findByToken(token);
        if (resetToken == null) {
            return ResponseEntity.badRequest().body("Token inválido.");
        }

        // Verificar si el token ha expirado
        LocalDateTime now = LocalDateTime.now();
        if (resetToken.getExpiryDate().isBefore(Instant.from(now))) {
            return ResponseEntity.badRequest().body("Token expirado.");
        }

        // Obtener el suario asociado con el token
        Optional<UserModels> optionalUser = userRepository.findById(resetToken.getUserId());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado.");
        }

        UserModels user = optionalUser.get();

        // Cifrar la nueva contraseña
        String encodedPassword = BCrypt.hashpw(newPassword, BCrypt.gensalt());

        // Actualizar la contraseña del usuario
        user.setContraseña(encodedPassword);
        userRepository.save(user);

        // Eliminar el token utilizado
        tokenRepository.delete(resetToken);

        return ResponseEntity.ok("Contraseña actualizada exitosamente.");
    }
}

