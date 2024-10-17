package com.example.sport_full.controllers;


import com.example.sport_full.models.*;
import com.example.sport_full.repositories.*;
import com.example.sport_full.services.*;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.swing.text.html.Option;
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
    ICompanyRepository companyRepository;

    @Autowired
    AdminServices adminServices;

    @Autowired
    ConfirmEmailReservationServices confirmEmailReservationServices;

    @Autowired
    IUserRepository userRepository;
    @Autowired
    private ClientServices clientServices;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody ReservationsModels reservationsModels,
                                                     @RequestParam Long fieldId,
                                                     @RequestParam Long adminId,
                                                     @RequestParam Long clientId,
                                                     @RequestParam String userEmail) {
        try {

            Optional<UserModels> user = userRepository.findByEmail(userEmail);
            if (!user.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
            // Obtener los modelos de administrador y cancha
            Optional<UserModels> admin = adminServices.getUser(adminId);
            Optional<FieldModels> field = fieldRepository.findById(fieldId);
            Optional<UserModels> client = clientServices.getClient(clientId);

            if (admin.isPresent() && field.isPresent() && client.isPresent()) {
                FieldModels fieldModel = field.get();
                UserModels userModels = client.get();

                // Verificar que la cancha pertenece al administrador (empresa)
                if (!fieldModel.getAdminModels().getId().equals(admin.get().getId())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("La cancha no pertenece a esta empresa.");
                }

                // Asignar el administrador y la cancha a la reserva y tambien el usuario
                reservationsModels.setAdminModels(fieldModel.getAdminModels());
                reservationsModels.setFieldModels(fieldModel);
                reservationsModels.setUserModels(userModels);


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

    @GetMapping("/user")
    public ResponseEntity<List<ReservationsModels>> getReservationsByUser(@RequestParam Long userId) {
        Optional<UserModels> user = userRepository.findById(userId);
        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        List<ReservationsModels> reservations = reservationsServices.getReservationsByUser(user.get());
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/empresa")
    public ResponseEntity<List<ReservationsModels>> getReservationsByCompany(@RequestParam Long empresaId) {
        Optional<AdminModels> admin = companyRepository.findById(empresaId);
        if (!admin.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        List<ReservationsModels> reservations = reservationsServices.getReservationsByAdmin(admin.get());
        return ResponseEntity.ok(reservations);
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

    @PutMapping("/cancelReservation")
    public ResponseEntity<?> cancelReservation(@RequestParam Long reservationId) {
        try {
            // Llamar al servicio para cancelar la reserva
            ReservationsModels canceledReservation = reservationsServices.cancelReservation(reservationId);
            return ResponseEntity.ok("Reserva cancelada exitosamente. Estado actual: " + canceledReservation.getEstadoReserva());
        } catch (ResponseStatusException e) {
            // Manejar error si la reserva no se encuentra
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reserva no encontrada.");
        } catch (Exception e) {
            // Manejar otros errores
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al cancelar la reserva.");
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