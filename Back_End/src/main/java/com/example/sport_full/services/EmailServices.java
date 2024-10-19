package com.example.sport_full.services;

import com.example.sport_full.models.UserModels;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServices {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailServices(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String email, String verificationToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Verificación de Correo");
        message.setText("Para verificar tu correo, por favor haz clic en el siguiente enlace: "
                + "http://localhost:5173/auth/verify?token=" + verificationToken);
        mailSender.send(message);
    }
}
