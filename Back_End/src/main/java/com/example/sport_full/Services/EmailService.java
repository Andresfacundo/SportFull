package com.example.sport_full.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // URL base de la aplicación (puede ser necesario ajustar para producción)
    private static final String BASE_URL = "http://localhost:8080";

    public void sendVerificationEmail(String toEmail, String token) {
        // Construir el enlace de verificación
        String verificationLink = BASE_URL + "/auth/verify?token=" + token;

        // Crear el mensaje
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Verificación de correo");
        message.setText("Por favor verifica tu correo haciendo clic en el siguiente enlace: \n" + verificationLink);
        message.setFrom("tu-email@example.com");

        // Enviar el correo
        mailSender.send(message);
    }
}
