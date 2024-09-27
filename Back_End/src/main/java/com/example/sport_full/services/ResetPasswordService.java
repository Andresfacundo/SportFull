package com.example.sport_full.services;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class ResetPasswordService {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendPasswordResetEmail(String recipientEmail, String resetLink) {
        // Creamos el mensaje Mime
        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            // Helper para construir el mensaje
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // Configuramos el destinatario, el asunto y el contenido
            helper.setTo(recipientEmail);
            helper.setSubject("Recuperación de contraseña");

            // Construir el cuerpo del correo en formato HTML con el enlace de restablecimiento
            String emailContent = "<html><body>"
                    + "<p>Hola,</p>"
                    + "<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>"
                    + "<p><a href=\"" + resetLink + "\">Restablecer contraseña</a></p>"
                    + "<p>Si no solicitaste este cambio, ignora este correo.</p>"
                    + "</body></html>";

            // Indicamos que el contenido es HTML
            helper.setText(emailContent, true);

            // Enviar el correo
            javaMailSender.send(message);
            System.out.println("Correo enviado exitosamente.");
        } catch (MessagingException e) {
            // Registrar el error y lanzar excepción si falla el envío del correo
            System.err.println("Error al enviar el correo: " + e.getMessage());
            throw new RuntimeException("Error al enviar el correo", e);
        }
    }
}

