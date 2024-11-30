package com.example.sport_full.services;

import com.example.sport_full.models.ReservationsModels;
import org.springframework.beans.factory.annotation.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
public class ConfirmEmailReservationServices {
    @Autowired
    private JavaMailSender mailSender;

    public void sendReservationConfirmation(String to, String subject, ReservationsModels reservation) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("procanchasarmeniapca@gmail.com");
        message.setTo(to);
        message.setSubject(subject);

        // Extraer detalles de la reserva
        String canchaNombre = reservation.getFieldModels().getNombre();
        LocalDateTime fechaHoraInicio = reservation.getFechaHoraInicio();
        LocalDateTime fechaHoraFin = reservation.getFechaHoraFin();
        Long costoTotal = reservation.getCostoTotal();
        String nombreEmpresa = reservation.getAdminModels().getNombreEmpresa();

        // Construir el mensaje de correo
        String text = "¡Gracias por reservar con nosotros!\n" +
                "Nombre Empresa " + nombreEmpresa + "\n" +
                "Detalles de tu reserva:\n" +
                "Cancha: " + canchaNombre + "\n" +
                "Hora de inicio: " + fechaHoraInicio + "\n" +
                "Hora de fin: " + fechaHoraFin + "\n" +
                "Costo total: " + costoTotal + " USD\n\n" +
                "Te esperamos en nuestras instalaciones. Si tienes alguna duda o quieres modificar tu reserva, no dudes en contactarnos.\n\n" +
                "¡Gracias por confiar en nosotros!";

        message.setText(text);
        mailSender.send(message);
    }
}
