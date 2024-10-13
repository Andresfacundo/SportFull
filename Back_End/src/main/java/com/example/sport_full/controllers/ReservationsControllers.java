package com.example.sport_full.controllers;


import com.example.sport_full.models.*;
import com.example.sport_full.repositories.*;
import com.example.sport_full.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/reservas")
public class ReservationsControllers {

    @Autowired
    ReservationsServices reservationsServices;

    @Autowired
    IReservationsRepository reservationsRepository;

    @Autowired
    IFieldRepository fieldRepository;

    @Autowired
    IUserRepository userRepository;

    @Autowired
    UserServices userServices;

    @Autowired
    ICompanyRepository companyRepository;

    @Autowired
    AdminServices adminServices;

    @Autowired
    ConfirmEmailReservationServices confirmEmailReservationServices;

    @PostMapping("/create")
    public ResponseEntity<ReservationsModels> create(@RequestBody ReservationsModels reservationsModels,
                                                     @RequestParam Long fieldId,
                                                     @RequestParam Long adminId,
                                                     @RequestParam String userEmail) {
        try {
            // Obtener los modelos de administrador y cancha
            Optional<UserModels> admin = adminServices.getUser(adminId);
            Optional<FieldModels> field = fieldRepository.findById(fieldId);


            if (admin.isPresent() && field.isPresent()) {
                FieldModels fieldModel = field.get();


                // Asignar el administrador y la cancha a la reserva
                reservationsModels.setAdminModels(fieldModel.getAdminModels());
                reservationsModels.setFieldModels(fieldModel);

                // Crear la nueva reserva
                ReservationsModels newReservation = reservationsServices.createReservation(reservationsModels);

                // Enviar el correo de confirmación al usuario
                String subject = "Confirmación de tu reserva";
                confirmEmailReservationServices.sendReservationConfirmation(userEmail, subject, newReservation);


                return ResponseEntity.ok(newReservation);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/createReservation")
    public ResponseEntity<ReservationsModels> createReservation(@RequestBody ReservationsModels reservationsModels,
                                                                @RequestParam Long fieldId,
                                                                @RequestParam Long clientId) {
        try {
            // Obtener los modelos de cliente y cancha
            Optional<UserModels> client = userServices.getUser(clientId);
            Optional<FieldModels> field = fieldRepository.findById(fieldId);

            if (client.isPresent() && field.isPresent()) {
                FieldModels fieldModel = field.get();
                UserModels userModel = client.get();

                // Asignar el cliente, la cancha y el estado de la reserva a la reserva
                reservationsModels.setFieldModels(fieldModel);
                reservationsModels.setUserModels(userModel);
                reservationsModels.setEstadoReserva(ReservationsModels.estadoReserva.PENDIENTE); // Asignar estado por defecto
                reservationsModels.setCostoTotal(reservationsModels.getCostoHora() * 2); // Ejemplo para calcular el costo total (2 horas)

                // Crear la nueva reserva
                ReservationsModels newReservation = reservationsServices.createReservation(reservationsModels);

                // Enviar el correo de confirmación al usuario
                String subject = "Confirmación de tu reserva";
                confirmEmailReservationServices.sendReservationConfirmation(reservationsModels.getUserEmail(), subject, newReservation);

                return ResponseEntity.ok(newReservation);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationsModels> getReservationById(@PathVariable("id") Long id) {
        return reservationsServices.getReservationById(id)
                .map(reservation -> new ResponseEntity<>(reservation, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/findAll")
    public List<ReservationsModels> findAll() {
        return reservationsServices.getAllReservations();
    }

    @PutMapping("/{reservationId}")
    public ResponseEntity<ReservationsModels> updateReservation(
            @PathVariable Long reservationId,
            @RequestBody ReservationsModels updatedReservation) {
        try {
            ReservationsModels reservation = reservationsServices.updateReservation(reservationId, updatedReservation);
            return ResponseEntity.ok(reservation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{reservationId}")
    public ResponseEntity<String> deleteReservation(@PathVariable Long reservationId) {
        try {
            reservationsServices.deleteReservation(reservationId);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}