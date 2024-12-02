package com.example.sport_full.services;

import com.example.sport_full.dto.SupportRequestDTO;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.swing.plaf.synth.SynthTextAreaUI;
import java.io.UnsupportedEncodingException;

@Service
public class SupportServices {

    private final JavaMailSender mailSender;

    // Valores dinámicos para el remitente
    @Value("${soporte.email}")
    public String soporteEmail;

    @Value("${soporte.nombre}")
    public String soporteNombre;

    public SupportServices(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendSupportEmail(SupportRequestDTO request, String emailDestinatario, String remitente)
            throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);


        helper.setFrom(remitente, request.getNombre());
        helper.setTo(emailDestinatario);
        helper.setSubject(request.getAsunto());
        helper.setText(String.format(
                "Nombre: %s\nCorreo: %s\nMensaje: %s",
                request.getNombre(), request.getCorreo(), request.getMensaje()
        ));

        // Enviar el correo
        mailSender.send(message);
    }

}

