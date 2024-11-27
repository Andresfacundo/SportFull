package com.example.sport_full.controllers;

import com.example.sport_full.dto.SupportRequestDTO;
import com.example.sport_full.services.SupportServices;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/api/soporte")
public class SupportController {

    @Autowired
    SupportServices supportServices;

    @PostMapping("/enviar")
    public ResponseEntity<String> enviarPeticion(@RequestBody SupportRequestDTO request) {
        try {
            supportServices.sendSupportEmail(request);
            return ResponseEntity.ok("Petición de soporte enviada correctamente.");
        } catch (MessagingException e) {
            return ResponseEntity.status(500).body("Error al enviar la petición de soporte.");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
}
