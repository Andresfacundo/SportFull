package com.example.sport_full.services;


import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.FieldModels;
import com.example.sport_full.models.ReservationsModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.ICompanyRepository;
import com.example.sport_full.repositories.IFieldRepository;
import com.example.sport_full.repositories.IReservationsRepository;
import com.example.sport_full.repositories.IUserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

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

    FieldModels fieldModels;

    public ReservationsModels createReservation(ReservationsModels reservation) {
        if (reservation.getFechaHoraInicio().equals(reservation.getFechaHoraFin())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La hora de inicio y fin no pueden ser iguales.");
        }

        // Obtener las reservas existentes en el rango de la fecha seleccionada
        List<String> horariosReservados = obtenerHorariosReservados(
                reservation.getFieldModels().getId(), // ID de la cancha
                reservation.getFechaHoraInicio().toLocalDate()
        );

        // Validar que no haya conflicto con las reservas existentes
        ReservationsModels finalReservation = reservation;
        boolean conflicto = horariosReservados.stream().anyMatch(horario -> {
            String[] partes = horario.split("-");
            LocalTime inicioReservado = LocalTime.parse(partes[0]);
            LocalTime finReservado = LocalTime.parse(partes[1]);

            // Validar si hay un traslape real (adyacencia permitida)
            return (
                    finalReservation.getFechaHoraInicio().toLocalTime().isBefore(finReservado) && // Empieza antes del final reservado
                            finalReservation.getFechaHoraFin().toLocalTime().isAfter(inicioReservado) && // Termina después del inicio reservado
                            !finalReservation.getFechaHoraInicio().toLocalTime().equals(finReservado) && // No es adyacente por la izquierda
                            !finalReservation.getFechaHoraFin().toLocalTime().equals(inicioReservado)    // No es adyacente por la derecha
            );
        });

        if (conflicto) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una reserva que traslapa con este horario: " +
                    horariosReservados.stream().filter(horario -> {
                        String[] partes = horario.split("-");
                        LocalTime inicioReservado = LocalTime.parse(partes[0]);
                        LocalTime finReservado = LocalTime.parse(partes[1]);
                        LocalTime inicioNuevaReserva = finalReservation.getFechaHoraInicio().toLocalTime();
                        LocalTime finNuevaReserva = finalReservation.getFechaHoraFin().toLocalTime();
                        return !(finNuevaReserva.equals(inicioReservado) || inicioNuevaReserva.equals(finReservado)) &&
                                (inicioNuevaReserva.isBefore(finReservado) && finNuevaReserva.isAfter(inicioReservado));
                    }).findFirst().orElse("N/A"));
        }



        // Guardar la reserva inicialmente con estado PENDIENTE
        reservation.setEstadoReserva(ReservationsModels.estadoReserva.PENDIENTE);
        reservation = reservationsRepository.save(reservation);

        // Programar la tarea para cambiar el estado a CANCELADA si no se confirma en 30 segundos
        programarCambioEstado(reservation);

        return reservation;
    }

    // Método para programar el cambio de estado a CANCELADA después de 30 segundos
    private void programarCambioEstado(ReservationsModels reservation) {
        Executors.newSingleThreadScheduledExecutor().schedule(() -> {
            // Verificar el estado de la reserva y actualizar si sigue en PENDIENTE
            actualizarEstadoSiNoConfirmada(reservation);
        }, 240, TimeUnit.SECONDS);
    }

    // Método que cambia el estado a CANCELADA si la reserva sigue en PENDIENTE después de 30 segundos
    private void actualizarEstadoSiNoConfirmada(ReservationsModels reservation) {
        Optional<ReservationsModels> reservaPersistida = reservationsRepository.findById(reservation.getId());
        if (reservaPersistida.isPresent()) {
            ReservationsModels reserva = reservaPersistida.get();
            // Si la reserva sigue en PENDIENTE, cambiar su estado a CANCELADA
            if (reserva.getEstadoReserva() == ReservationsModels.estadoReserva.PENDIENTE) {
                reserva.setEstadoReserva(ReservationsModels.estadoReserva.CANCELADA);
                reservationsRepository.save(reserva);
            }
        }
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

    // Método para obtener el valor total de reservas de una empresa, filtrado por estado y/o cancha
    public Double getTotalReservationsValue(Long empresaId, ReservationsModels.estadoReserva estado, Long canchaId,LocalDateTime fechaHoraInicio, LocalDateTime fechaHoraFin) {

        if (canchaId != null  && !reservationsRepository.existsByAdminModels_IdAndFieldModels_Id(empresaId, canchaId)){
            throw new IllegalArgumentException("La cancha no pertenece a la empresa");
        }

        List<ReservationsModels> reservations;
        // Filtrar según los parámetros que no sean null
        if (estado != null && canchaId != null) {
            reservations = reservationsRepository.findByAdminModels_IdAndFieldModels_IdAndEstadoReserva(empresaId, canchaId, estado);
        } else if (estado != null) {
            reservations = reservationsRepository.findByAdminModels_IdAndEstadoReserva(empresaId, estado);
        } else if (canchaId != null) {
            reservations = reservationsRepository.findByAdminModels_IdAndFieldModels_Id(empresaId, canchaId);
        } else if (fechaHoraInicio !=null && fechaHoraFin !=null) {
            reservations = reservationsRepository.findByAdminModels_IdAndFechaHoraInicioBetween(empresaId,fechaHoraInicio, fechaHoraFin);

        } else {
            reservations = reservationsRepository.findByAdminModels_Id(empresaId);

        }

        // Calcular el valor total sumando el costo de cada reserva filtrada
        return reservations.stream()
                .mapToDouble(ReservationsModels::getCostoTotal)
                .sum();
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

    public List<String> obtenerHorariosReservados(Long idCancha, LocalDate fecha) {
        List<Object[]> horariosReservados = reservationsRepository.findHorariosByCanchaAndFecha(idCancha, fecha);

        return horariosReservados.stream()
                .map(horario -> {
                    LocalDateTime inicio = (LocalDateTime) horario[0];
                    LocalDateTime fin = (LocalDateTime) horario[1];
                    return inicio.toLocalTime() + "-" + fin.toLocalTime();
                })
                .collect(Collectors.toList());
    }

    private List<String> generarHorarios(LocalTime inicio, LocalTime fin) {
        List<String> horarios = new ArrayList<>();
        LocalTime actual = inicio;

        while (actual.isBefore(fin)) {
            LocalTime siguiente = actual.plusHours(1); // Generar bloques de 1 hora
            horarios.add(formatHorario(actual, siguiente)); // Formatear horario
            actual = siguiente;
        }

        return horarios;
    }

    private String formatHorario(LocalTime inicio, LocalTime fin) {
        return String.format("%02d:00-%02d:00", inicio.getHour(), fin.getHour());
    }

    public ReservationsModels partialUpdateReservation(Long reservationId, Map<String, Object> updates) {
        ReservationsModels reservation = reservationsRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada"));

        // Calcula la duración original
        Duration originalDuration = Duration.between(reservation.getFechaHoraInicio(), reservation.getFechaHoraFin());

        // Variables para los nuevos valores (si se proporcionan)
        LocalDateTime newFechaHoraInicio = reservation.getFechaHoraInicio();
        LocalDateTime newFechaHoraFin = reservation.getFechaHoraFin();

        // Validar y actualizar fechaHoraInicio
        if (updates.containsKey("fechaHoraInicio")) {
            String fechaHoraInicioStr = (String) updates.get("fechaHoraInicio");
            newFechaHoraInicio = LocalDateTime.parse(fechaHoraInicioStr); // Convierte la cadena a LocalDateTime
        }

        // Validar y actualizar fechaHoraFin
        if (updates.containsKey("fechaHoraFin")) {
            String fechaHoraFinStr = (String) updates.get("fechaHoraFin");
            newFechaHoraFin = LocalDateTime.parse(fechaHoraFinStr); // Convierte la cadena a LocalDateTime
        }

        // Validar que la nueva duración sea igual a la original
        Duration newDuration = Duration.between(newFechaHoraInicio, newFechaHoraFin);
        if (!newDuration.equals(originalDuration)) {
            throw new IllegalArgumentException("La duración de la reprogramación debe ser igual a la duración original");
        }

        // Si la validación pasa, actualiza la reserva
        reservation.setFechaHoraInicio(newFechaHoraInicio);
        reservation.setFechaHoraFin(newFechaHoraFin);

        return reservationsRepository.save(reservation);
    }
}
