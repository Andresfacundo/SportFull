package com.example.sport_full.controllers;

import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.FieldModels;
import com.example.sport_full.models.ReservationsModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.ICompanyRepository;
import com.example.sport_full.repositories.IFieldRepository;
import com.example.sport_full.repositories.IReservationsRepository;
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



    @PostMapping("/create")
    public ResponseEntity<ReservationsModels> create(@RequestBody ReservationsModels reservationsModels, @RequestParam Long fielId  , @RequestParam Long AdminId ) {
        try {
            Optional<UserModels> admin = adminServices.getUser(AdminId);
            Optional<FieldModels> field = fieldRepository.findById(fielId);

            if (admin.isPresent() && field.isPresent()) {
                UserModels user = admin.get();
                FieldModels fieldModel = field.get();

                reservationsModels.setAdminModels(user.getAdminModels());
                reservationsModels.setFieldModels(fieldModel);

            ReservationsModels newReservation = reservationsServices.createReservation(reservationsModels);
            return ResponseEntity.ok(newReservation);

            }else{
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