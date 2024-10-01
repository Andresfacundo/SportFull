package com.example.sport_full.controllers;

import com.example.sport_full.models.*;
import com.example.sport_full.repositories.*;
import com.example.sport_full.services.AdminServices;
import com.example.sport_full.services.ReservationsServices;
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
    ICompanyRepository companyRepository;

    @Autowired
    AdminServices adminServices;

    @Autowired
    IGestorRepository gestorRepository;

    @Autowired
    IClientRepository clientRepository;

    @PostMapping("/create")
    public ResponseEntity<ReservationsModels> create(@RequestBody ReservationsModels reservationsModels,
                                                     @RequestParam Long fielId,
                                                     @RequestParam Long gestorId) {
        try {
            // Verificar si el usuario es un Gestor válido
            Optional<GestorModels> gestor = gestorRepository.findById(gestorId);
            Optional<FieldModels> field = fieldRepository.findById(fielId);

            if (gestor.isPresent() && field.isPresent()) {
                FieldModels fieldModel = field.get();

                // Asignar el gestor, campo y usuario a la reserva
                reservationsModels.setAdminModels(gestor.get().getAdminempresa());
                reservationsModels.setFieldModels(fieldModel);

                // Crear la reserva
                ReservationsModels newReservation = reservationsServices.createReservation(reservationsModels);
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