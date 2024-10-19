package com.example.sport_full.controllers;

import com.example.sport_full.services.VerificationsEmailServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@Service
public class VerificationEmailControllers {
    @Autowired
    private VerificationsEmailServices userService;

    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token) {
        boolean isVerified = userService.verifyEmail(token);
        if (isVerified) {
            return ResponseEntity.ok("Correo verificado con éxito.");
        } else {
            return ResponseEntity.badRequest().body("Token inválido o expirado.");
        }
    }
}
