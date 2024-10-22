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
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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

    @Autowired
    IClientRepository clientRepository;

    @Autowired
    IGestorRepository gestorRepository;

    @Autowired
    SendReservationConfirmation sendReservationConfirmation;

    @Autowired
    ConfirmReservationServices confirmReservationServices;

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

    @PostMapping("/createReservation")
    public ResponseEntity<?> createTwoReservation(@RequestBody List<ReservationsModels> reservationsList,
                                    @RequestParam Long adminId,
                                    @RequestParam Long clientId,
                                    @RequestParam String userEmail) {
        try {
            Optional<UserModels> user = userRepository.findByEmail(userEmail);
            if (!user.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuario no encontrado.");
            }

            Optional<UserModels> admin = adminServices.getUser(adminId);
            Optional<UserModels> client = clientServices.getClient(clientId);

            if (admin.isPresent() && client.isPresent()) {
                List<ReservationsModels> createdReservations = new ArrayList<>();

                for (ReservationsModels reservation : reservationsList) {
                    Long fieldId = reservation.getFieldModels().getId();
                    Optional<FieldModels> field = fieldRepository.findById(fieldId);

                    if (field.isPresent()) {
                        FieldModels fieldModel = field.get();

                        // Verificar que la cancha pertenece al administrador (empresa)
                        if (!fieldModel.getAdminModels().getId().equals(admin.get().getId())) {
                            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                    .body("Una de las canchas no pertenece a esta empresa.");
                        }

                        // Asignar el administrador y la cancha a la reserva y el usuario
                        reservation.setAdminModels(fieldModel.getAdminModels());
                        reservation.setFieldModels(fieldModel);
                        reservation.setUserModels(client.get());

                        // Agregar la reserva a la lista de creadas
                        ReservationsModels newReservation = reservationsServices.createReservation(reservation);
                        createdReservations.add(newReservation);
                    } else {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cancha no encontrada.");
                    }
                }

                // Enviar el correo de confirmación al usuario para todas las reservas
                String subject = "Confirmación de tus reservas";
                confirmReservationServices.ReservationConfirmation(userEmail, subject, createdReservations);

                return ResponseEntity.ok(createdReservations);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Administrador o cliente no encontrado.");
            }
        } catch (RuntimeException e) {
            e.printStackTrace(); // Esto imprimirá el stacktrace completo en los logs del servidor.
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }


    // gestor realiza reserva a nombre de
    @PostMapping("/gestor/reserva")
    public ResponseEntity<?> createReservaByGestor(@RequestBody Map<String, Object> requestData, @RequestParam Long gestorId) {
        try {
            // Extraer los datos del cliente desde la solicitud
            String nombres = (String) requestData.get("nombres");
            String apellidos = (String) requestData.get("apellidos");
            String email = (String) requestData.get("email");
            String telefono = (String) requestData.get("telefono");
            Long fieldId = Long.parseLong(requestData.get("fieldId").toString());
            LocalDateTime fechaHoraInicio = LocalDateTime.parse((String) requestData.get("fechaHoraInicio"));
            LocalDateTime fechaHoraFin = LocalDateTime.parse((String) requestData.get("fechaHoraFin"));
            Long costoHora = Long.parseLong(requestData.get("costoHora").toString());

            // Validar que los datos requeridos del cliente no sean nulos o vacíos
            if (nombres == null || apellidos == null || email == null || telefono == null || fieldId == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Todos los datos del cliente y del campo son requeridos.");
            }

            // Verificar si el gestor existe
            Optional<GestorModels> gestorOptional = gestorRepository.findById(gestorId);
            if (!gestorOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El gestor no existe.");
            }
            GestorModels gestor = gestorOptional.get();

            // Verificar si la cancha existe
            Optional<FieldModels> fieldOptional = fieldRepository.findById(fieldId);
            if (!fieldOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La cancha no existe.");
            }
            FieldModels field = fieldOptional.get();

            // Verificar si el usuario ya existe
            Optional<UserModels> existingUserOptional = userRepository.findByEmail(email);
            UserModels user;
            if (existingUserOptional.isPresent()) {
                // Si el usuario ya existe, usar el existente
                user = existingUserOptional.get();
            } else {
                // Si el usuario no existe, crearlo
                user = new UserModels();
                user.setNombres(nombres);
                user.setApellidos(apellidos);
                user.setEmail(email);
                user.setTipoUsuario("No registrado");
                user.setContraseña("NA"); // Puede ser un valor por defecto ya que no es un usuario registrado formalmente
                user.setEstadoCuenta(false); // Activado por defecto para este caso específico
                userRepository.save(user);

                // Crear un nuevo cliente asociado al usuario
                ClientModels client = new ClientModels();
                client.setTelefono(telefono);
                client.setUserModels(user);
                clientRepository.save(client);
            }

            // Crear una nueva reserva
            ReservationsModels reserva = new ReservationsModels();
            reserva.setFieldModels(field);
            reserva.setUserModels(user);
            reserva.setAdminModels(gestor.getAdminempresa());
            reserva.setFechaHoraInicio(fechaHoraInicio);
            reserva.setFechaHoraFin(fechaHoraFin);
            reserva.setFechaPago(LocalDate.now());
            reserva.setCostoHora(costoHora);
            reserva.setCostoTotal(costoHora * (Duration.between(fechaHoraInicio, fechaHoraFin).toHours()));
            reserva.setEstadoReserva(ReservationsModels.estadoReserva.PENDIENTE);

            // Guardar la reserva en la base de datos
            reservationsRepository.save(reserva);

            String nombreGestor = gestor.getUserModels().getNombres() + " " + gestor.getUserModels().getApellidos();

            String subject = "Confirmación de Reserva";
            String message = "Estimado/a " + nombres + " " + apellidos + ",\n\n" +
                    "Su reserva de la cancha '" + field.getNombre() + "' ha sido creada exitosamente.\n" +
                    "Fecha y hora de inicio: " + fechaHoraInicio + "\n" +
                    "Fecha y hora de fin: " + fechaHoraFin + "\n" +
                    "Costo total: " + reserva.getCostoTotal() + "\n" +
                    "Nombre de quien te realizo la reserva " + nombreGestor + "\n\n" +
                    "Gracias por confiar en nuestro servicio.";
            sendReservationConfirmation.sendReservationConfirmation(email, subject, message);


            return ResponseEntity.ok("Reserva creada exitosamente a nombre de " + nombres + " " + apellidos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
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