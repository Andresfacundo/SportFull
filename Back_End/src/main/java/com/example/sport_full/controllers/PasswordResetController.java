package com.example.sport_full.controllers;

import com.example.sport_full.Services.EmailService;
import com.example.sport_full.models.PasswordResetToken;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.IUserRepository;
import com.example.sport_full.repositories.TokenRepository;
import com.example.sport_full.utils.TokenGenerator;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;

import static java.time.LocalDateTime.now;

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

    // Método para solicitar el restablecimiento de contraseña
    @PostMapping("/reset")
    public ResponseEntity<String> processPasswordResetRequest(@RequestParam String email) {
        Optional<UserModels> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("El correo no está registrado.");
        }

        UserModels user = optionalUser.get();
        String token = TokenGenerator.generateToken();
        PasswordResetToken resetToken = new PasswordResetToken(token, user.getId(), now().plusMinutes(30));
        tokenRepository.save(resetToken);

        String resetLink = "http://localhost:8080/password/reset-password?token=" + token;

        try {
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al enviar el correo de recuperación.");
        }

        return ResponseEntity.ok("Correo de recuperación enviado.");
    }

    // Mostrar el formulario de restablecimiento de contraseña
    @GetMapping("/reset-password")
    public ResponseEntity<String> showResetForm(@RequestParam String token) {
        // Buscar el token en la base de datos
        PasswordResetToken resetToken = tokenRepository.findByToken(token);

        if (resetToken == null) {
            return ResponseEntity.badRequest().body("El enlace de restablecimiento es inválido.");
        }

        // Obtener la fecha y hora actual
        LocalDateTime now = LocalDateTime.now();

        // Verificar si el token ha expirado
        if (resetToken.getExpiryDate().isBefore(now)) {
            return ResponseEntity.badRequest().body("El enlace de restablecimiento ha expirado.");
        }

        // Si el token es válido, mostrar el formulario de restablecimiento de contraseña
        String htmlForm = "<html>" +
                "<body>" +
                "<h1>Restablecer contraseña</h1>" +
                "<form action='/password/reset-password' method='POST'>" +
                "<input type='hidden' name='token' value='" + token + "'/>" +
                "<label>Nueva contraseña:</label>" +
                "<input type='password' name='newPassword' required/>" +
                "<button type='submit'>Restablecer contraseña</button>" +
                "</form>" +
                "</body>" +
                "</html>";

        return ResponseEntity.ok(htmlForm);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        try {
            // Buscar el token de restablecimiento
            PasswordResetToken resetToken = tokenRepository.findByToken(token);
            if (resetToken == null) {
                return ResponseEntity.badRequest().body("Token inválido.");
            }

            // Verificar si el token ha expirado
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime expiryDate = resetToken.getExpiryDate();
            if (expiryDate.isBefore(now)) {
                return ResponseEntity.badRequest().body("Token expirado.");
            }

            // Buscar el usuario asociado al token
            Optional<UserModels> optionalUser = userRepository.findById(resetToken.getUserId());
            if (optionalUser.isEmpty()) {
                return ResponseEntity.badRequest().body("Usuario no encontrado.");
            }

            UserModels user = optionalUser.get();
            String encodedPassword = BCrypt.hashpw(newPassword, BCrypt.gensalt());

            // Actualizar la contraseña del usuario
            user.setContraseña(encodedPassword);
            userRepository.save(user);

            // Eliminar el token después de usarlo
            tokenRepository.delete(resetToken);

            return ResponseEntity.ok("Contraseña actualizada exitosamente.");
        } catch (Exception e) {
            // Registrar el error y devolver un mensaje amigable
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ocurrió un error al restablecer la contraseña.");
        }
    }


}
