package com.example.sport_full.services;


import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.ReservationsModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.ICompanyRepository;
import com.example.sport_full.repositories.IFieldRepository;
import com.example.sport_full.repositories.IReservationsRepository;
import com.example.sport_full.repositories.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


import java.util.List;
import java.util.Optional;

@Service
public class ReservationsServices {

    @Autowired
    IReservationsRepository reservationsRepository;

    @Autowired
    IUserRepository userRepository;

    @Autowired
    IFieldRepository fieldRepository;

    @Autowired
    ICompanyRepository companyRepository;

    public ReservationsModels createReservation(ReservationsModels reservation) {
        if(reservation.getFechaHoraInicio().equals(reservation.getFechaHoraFin())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        return reservationsRepository.save(reservation);
    }

    public List<ReservationsModels> getAllReservations() {
        return reservationsRepository.findAll();
    }

    public Optional<ReservationsModels> getReservationById(Long id) {
        return reservationsRepository.findById(id);
    }

    public List<ReservationsModels> getReservationsByUser(UserModels user) {
        return reservationsRepository.findByUserModels(user);
    }

    public List<ReservationsModels> getReservationsByAdmin(AdminModels admin) {
        return reservationsRepository.findByFieldModels_AdminModels(admin);
    }

    public ReservationsModels updateReservation(Long reservationId, ReservationsModels updatedReservation) {
        Optional<ReservationsModels> existingReservation = reservationsRepository.findById(reservationId);

        if (existingReservation.isPresent()) {
            ReservationsModels reservation = existingReservation.get();

            reservation.setFechaHoraInicio(updatedReservation.getFechaHoraInicio());
            reservation.setFechaHoraFin(updatedReservation.getFechaHoraFin());
            reservation.setFechaPago(updatedReservation.getFechaPago());
            reservation.setEstadoReserva(updatedReservation.getEstadoReserva());
            reservation.setCostoHora(updatedReservation.getCostoHora());
            reservation.setCostoTotal(updatedReservation.getCostoTotal());

            return reservationsRepository.save(reservation);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    public ReservationsModels cancelReservation(Long reservationId) {
        Optional<ReservationsModels> existingReservation = reservationsRepository.findById(reservationId);

        if (existingReservation.isPresent()) {
            ReservationsModels reservation = existingReservation.get();

            // Verificar si la reserva ya está cancelada
            if (reservation.getEstadoReserva() == ReservationsModels.estadoReserva.CANCELADA) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La reserva ya está cancelada.");
            }

            // Cambiar el estado de la reserva a CANCELADA
            reservation.setEstadoReserva(ReservationsModels.estadoReserva.CANCELADA);

            // Guardar y devolver la reserva actualizada
            return reservationsRepository.save(reservation);
        } else {
            // Lanza una excepción si la reserva no existe
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Reserva no encontrada");
        }
    }

    public void deleteReservation(Long reservationId) {
        Optional<ReservationsModels> reservation = reservationsRepository.findById(reservationId);
        if (reservation.isPresent()) {
            reservationsRepository.deleteById(reservationId);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
}
