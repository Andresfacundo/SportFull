package com.example.sport_full.services;

import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.ReservationsModels;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConfirmReservationServices {
    @Autowired
    private JavaMailSender mailSender;

    // Método modificado para aceptar una lista de reservas
    public void ReservationConfirmation(String to, String subject, List<ReservationsModels> reservationsList) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("procanchasarmeniapca@gmail.com");
        message.setTo(to);
        message.setSubject(subject);

        String nombreEmpresa = reservationsList.get(0).getAdminModels().getNombreEmpresa();

        // Construir el mensaje de correo
        StringBuilder text = new StringBuilder();
        text.append("¡Gracias por reservar con nosotros!\n\n")
                .append("Detalles de tus reservas:\n")
                .append("Nombre Empresa: " + nombreEmpresa + "\n\n" );

        for (ReservationsModels reservation : reservationsList) {
            String canchaNombre = reservation.getFieldModels().getNombre();
            LocalDateTime fechaHoraInicio = reservation.getFechaHoraInicio();
            LocalDateTime fechaHoraFin = reservation.getFechaHoraFin();
            Long costoTotal = reservation.getCostoTotal();

            text.append("Cancha: ").append(canchaNombre).append("\n")
                    .append("Hora de inicio: ").append(fechaHoraInicio).append("\n")
                    .append("Hora de fin: ").append(fechaHoraFin).append("\n")
                    .append("Costo total: ").append(costoTotal).append(" USD\n\n");
        }

        text.append("Te esperamos en nuestras instalaciones. Si tienes alguna duda o quieres modificar tu reserva, no dudes en contactarnos.\n\n")
                .append("¡Gracias por confiar en nosotros!");

        message.setText(text.toString());
        mailSender.send(message);
    }
}
