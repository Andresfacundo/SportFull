package com.example.sport_full.services;

import com.example.sport_full.dto.SupportRequestDTO;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
public class SupportServices {

    private final JavaMailSender mailSender;

    // Valores dinámicos para el remitente
    @Value("${soporte.email}")
    private String soporteEmail;

    @Value("${soporte.nombre}")
    private String soporteNombre;

    public SupportServices(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendSupportEmail(SupportRequestDTO request) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        // Configurar remitente dinámico
        helper.setFrom(soporteEmail, soporteNombre);
        helper.setTo("procanchasarmeniapca@gmail.com"); // Correo de la empresa
        helper.setSubject(request.getAsunto());
        helper.setText(String.format(
                "Nombre: %s\nCorreo: %s\nMensaje: %s",
                request.getNombre(), request.getCorreo(), request.getMensaje()
        ));

        // Enviar correo
        mailSender.send(message);
    }
}

