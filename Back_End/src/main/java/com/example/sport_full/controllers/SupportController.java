package com.example.sport_full.controllers;

import com.example.sport_full.dto.SupportRequestDTO;
import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.ICompanyRepository;
import com.example.sport_full.repositories.IUserRepository;
import com.example.sport_full.services.SupportServices;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.Optional;

@RestController
@RequestMapping("/api/soporte")
public class SupportController {

    @Autowired
    SupportServices supportServices;

    @Autowired
    ICompanyRepository companyRepository;

    @Autowired
    IUserRepository userRepository;

    @PostMapping("/enviar")
    public ResponseEntity<String> enviarPeticion(@RequestBody SupportRequestDTO request) {
        try {
            // Validar si el correo está presente en el body
            if (request.getCorreo() == null || request.getCorreo().isEmpty()) {
                return ResponseEntity.badRequest().body("El correo del remitente es obligatorio.");
            }


            // Determinar el destinatario
            String emailDestinatario = supportServices.soporteEmail; // Valor predeterminado
            if (request.getCompany() != null) {
                Optional<AdminModels> company = companyRepository.findById(request.getCompany());
                if (!company.isPresent()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Empresa no encontrada.");
                }
                emailDestinatario = company.get().getEmailEmpresa(); // Correo de la empresa
            }

            // Enviar el correo usando el remitente del body
            supportServices.sendSupportEmail(request, emailDestinatario, request.getCorreo());

            return ResponseEntity.ok("Petición de soporte enviada correctamente.");
        } catch (MessagingException e) {
            return ResponseEntity.status(500).body("Error al enviar la petición de soporte.");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

}
