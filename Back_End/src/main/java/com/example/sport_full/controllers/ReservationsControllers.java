package com.example.sport_full.controllers;


import com.example.sport_full.models.*;
import com.example.sport_full.repositories.*;
import com.example.sport_full.services.*;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.swing.text.html.Option;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

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

    @Autowired
    ICompanyRepository adminRepository;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody ReservationsModels reservationsModels,
                                    @RequestParam Long fieldId,
                                    @RequestParam Long adminId,
                                    @RequestParam Long clientId,
                                    @RequestParam String userEmail) {
        try {
            Optional<UserModels> user = userRepository.findByEmail(userEmail);
            if (!user.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuario no encontrado.");
            }

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

                if (!userModels.getEmail().equals(userEmail)) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El email proporcionado no corresponde al cliente");
                }

                // Buscar reservas que puedan traslaparse
                List<ReservationsModels> reservasConflicto = reservationsRepository.findConflictingReservations(
                        fieldModel,
                        reservationsModels.getFechaHoraInicio(),
                        reservationsModels.getFechaHoraFin()
                );

                // Validar si existe un traslape real
                boolean existeTraslape = reservasConflicto.stream().anyMatch(reserva -> {
                    LocalDateTime inicioReservaExistente = reserva.getFechaHoraInicio();
                    LocalDateTime finReservaExistente = reserva.getFechaHoraFin();

                    LocalDateTime inicioNuevaReserva = reservationsModels.getFechaHoraInicio();
                    LocalDateTime finNuevaReserva = reservationsModels.getFechaHoraFin();

                    // No permitir que la nueva reserva coincida con las existentes, ni que se solapen
                    return !(finNuevaReserva.equals(inicioReservaExistente) || inicioNuevaReserva.equals(finReservaExistente)) &&
                            (inicioNuevaReserva.isBefore(finReservaExistente) && finNuevaReserva.isAfter(inicioReservaExistente));
                });

                if (existeTraslape) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe una reserva para esta cancha en el horario especificado.");
                }

                // Obtener el costo por hora de la cancha
                Double costoHora = fieldModel.getPrecio();

                // Calcular la duración de la reserva en horas
                long duracionHoras = Duration.between(reservationsModels.getFechaHoraInicio(), reservationsModels.getFechaHoraFin()).toHours();

                // Calcular el costo total
                Long costoTotal = (long) (costoHora * duracionHoras);
                reservationsModels.setCostoHora(costoHora);
                reservationsModels.setCostoTotal(costoTotal);
                reservationsModels.setFechaPago(LocalDate.now());

                // Asignar el administrador, la cancha, y el cliente a la reserva
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
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Administrador, cancha o cliente no encontrado.");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error al crear la reserva: " + e.getMessage());
        }
    }


    // gestor realiza reserva a nombre de...
    @PostMapping("/gestor/reserva")
    public ResponseEntity<?> createReservaByGestor(@RequestBody Map<String, Object> requestData, @RequestParam Long gestorId,
                                                   @RequestParam Long fieldId) {
        try {
            // Extraer los datos del cliente desde la solicitud
            String nombres = (String) requestData.get("nombres");
            String apellidos = (String) requestData.get("apellidos");
            String email = (String) requestData.get("email");
            String telefono = (String) requestData.get("telefono");
            LocalDateTime fechaHoraInicio = LocalDateTime.parse((String) requestData.get("fechaHoraInicio"));
            LocalDateTime fechaHoraFin = LocalDateTime.parse((String) requestData.get("fechaHoraFin"));

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


            // Validar si ya existe una reserva en la misma cancha y rango de horario
            boolean existeReserva = reservationsRepository.existsByFieldModelsAndFechaHoraInicioBetween(
                    field, fechaHoraInicio, fechaHoraFin
            );

            if (existeReserva) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe una reserva para esta cancha en el horario especificado.");
            }

            // Obtener el costo por hora de la cancha
            Double costoH = field.getPrecio();

            // Calcular la duración de la reserva en horas
            long duracionHoras = Duration.between(fechaHoraInicio, fechaHoraFin).toHours();

            // Calcular el costo total
            Long costoTotal = (long) (costoH * duracionHoras);



            // Validar que la cancha pertenece a la empresa del gestor
            if (!field.getAdminModels().getId().equals(gestor.getAdminModels().getId())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("La cancha no pertenece a la empresa del gestor.");
            }

            // Verificar que el gestor pertenece a la misma empresa que la cancha
            if (!gestor.getAdminModels().getId().equals(field.getAdminModels().getId())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("El gestor no pertenece a la misma empresa que la cancha.");
            }

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
            reserva.setAdminModels(gestor.getAdminModels());
            reserva.setFechaHoraInicio(fechaHoraInicio);
            reserva.setFechaHoraFin(fechaHoraFin);
            reserva.setCostoTotal(costoTotal);
            reserva.setCostoHora(costoH);
            reserva.setFechaPago(LocalDate.now());
            reserva.setEstadoReserva(ReservationsModels.estadoReserva.PENDIENTE);

            // Guardar la reserva en la base de datos
            reservationsRepository.save(reserva);

            String nombreGestor = gestor.getUserModels().getNombres() + " " + gestor.getUserModels().getApellidos();
            String nombreEmpresa = gestor.getAdminModels().getNombreEmpresa();

            String subject = "Confirmación de Reserva";
            String message = "Estimado/a " + nombres + " " + apellidos + ",\n\n" +
                    "Nombre Empresa " + nombreEmpresa + "\n\n" +
                    "Su reserva de la cancha '" + field.getNombre() + "' ha sido creada exitosamente.\n" +
                    "Fecha y hora de inicio: " + fechaHoraInicio + "\n" +
                    "Fecha y hora de fin: " + fechaHoraFin + "\n" +
                    "Costo total: " + costoTotal + "\n" +
                    "Nombre de quien te realizo la reserva " + nombreGestor + "\n\n" +
                    "Gracias por confiar en nuestro servicio.";
            sendReservationConfirmation.sendReservationConfirmation(email, subject, message);


            return ResponseEntity.ok("Reserva creada exitosamente a nombre de " + nombres + " " + apellidos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    //cambiar estado de reserva manualmente PENDIENTE a CONFIRMADA
    @PutMapping("/{id}/confirmar")
    public ResponseEntity<ReservationsModels> confirmReservation(@PathVariable Long id) {
        Optional<ReservationsModels> reservation = reservationsServices.getReservationById(id);
        if (reservation.isPresent()) {
            ReservationsModels reserva = reservation.get();

            // Verificar si el estado de la reserva es CANCELADA
            if (reserva.getEstadoReserva() == ReservationsModels.estadoReserva.CANCELADA) {
                // Si ya está CANCELADA, lanzar una excepción indicando que no se puede confirmar
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La reserva está CANCELADA y no se puede confirmar.");
            }

            // Cambiar el estado de la reserva a CONFIRMADA
            reserva.setEstadoReserva(ReservationsModels.estadoReserva.CONFIRMADA);
            reservationsServices.updateReservation(id, reserva);
            return new ResponseEntity<>(reserva, HttpStatus.OK);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Reserva no encontrada");
        }
    }

    //Crear reserva desde Admin una reserva para un usuario no registrado
    @PostMapping("/empresa/reserva")
    public ResponseEntity<?> createReservaByEmpresa(@RequestBody Map<String, Object> requestData, @RequestParam Long adminId,
                                                    @RequestParam Long fieldId) {
        try {
            // Extraer los datos del cliente desde la solicitud
            String nombres = (String) requestData.get("nombres");
            String apellidos = (String) requestData.get("apellidos");
            String email = (String) requestData.get("email");
            String telefono = (String) requestData.get("telefono");
//            Long fieldId = Long.parseLong(requestData.get("fieldId").toString());
            LocalDateTime fechaHoraInicio = LocalDateTime.parse((String) requestData.get("fechaHoraInicio"));
            LocalDateTime fechaHoraFin = LocalDateTime.parse((String) requestData.get("fechaHoraFin"));

            // Validar que los datos requeridos del cliente no sean nulos o vacíos
            if (nombres == null || apellidos == null || email == null || telefono == null || fieldId == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Todos los datos del cliente y del campo son requeridos.");
            }

            // Verificar si el administrador existe
            Optional<AdminModels> adminOptional = adminRepository.findById(adminId);
            if (!adminOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El administrador no existe.");
            }
            AdminModels admin = adminOptional.get();

            // Verificar si la cancha existe
            Optional<FieldModels> fieldOptional = fieldRepository.findById(fieldId);
            if (!fieldOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La cancha no existe.");
            }
            FieldModels field = fieldOptional.get();


            Double costoHo = field.getPrecio();

            // Calcular la duración de la reserva en horas
            long duracionHoras = Duration.between(fechaHoraInicio, fechaHoraFin).toHours();

            Long costoTotal = (long)(costoHo * duracionHoras);

            // Validar que la cancha pertenece a la empresa del gestor
            if (!field.getAdminModels().getId().equals(admin.getId())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("La cancha no pertenece a esta empresa.");
            }

            // Validar si ya existe una reserva en la misma cancha y rango de horario
            boolean existeReserva = reservationsRepository.existsByFieldModelsAndFechaHoraInicioBetween(
                    field, fechaHoraInicio, fechaHoraFin
            );

            if (existeReserva) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe una reserva para esta cancha en el horario especificado.");
            }

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
            reserva.setAdminModels(admin); // Asignar el administrador a la reserva
            reserva.setFechaHoraInicio(fechaHoraInicio);
            reserva.setFechaHoraFin(fechaHoraFin);
            reserva.setCostoTotal(costoTotal);
            reserva.setCostoHora(costoHo);
            reserva.setFechaPago(LocalDate.now());
            reserva.setEstadoReserva(ReservationsModels.estadoReserva.PENDIENTE);

            // Guardar la reserva en la base de datos
            reservationsRepository.save(reserva);

            String nombreEmpresa = admin.getUserModels().getNombres() + " " + admin.getUserModels().getApellidos();

            String subject = "Confirmación de Reserva";
            String message = "Estimado/a " + nombres + " " + apellidos + ",\n\n" +
                    "Su reserva de la cancha '" + field.getNombre() + "' ha sido creada exitosamente.\n" +
                    "Fecha y hora de inicio: " + fechaHoraInicio + "\n" +
                    "Fecha y hora de fin: " + fechaHoraFin + "\n" +
                    "Costo total: " + costoTotal + "\n" +
                    "Nombre de quien te realizo la reserva" + nombreEmpresa + "\n\n" +
                    "Gracias por confiar en nuestro servicio.";
            sendReservationConfirmation.sendReservationConfirmation(email, subject, message);

            return ResponseEntity.ok("Reserva creada exitosamente a nombre de " + nombres + " " + apellidos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    //Crear reserva como Cliente
    @PostMapping("/createReservation")
    public ResponseEntity<?> createTwoReservation(
            @RequestBody List<ReservationsModels> reservationsList,
            @RequestParam Long adminId,
            @RequestParam Long clientId,
            @RequestParam String userEmail,
            @RequestParam List<Long> fieldIds) {
        try {
            Optional<UserModels> user = userRepository.findByEmail(userEmail);
            if (!user.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuario no encontrado.");
            }

            Optional<UserModels> admin = adminServices.getUser(adminId);
            Optional<UserModels> client = clientServices.getClient(clientId);
            if (admin.isPresent() && client.isPresent()) {
                if (!client.get().getEmail().equals(userEmail)) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("El correo proporcionado no coincide con el del cliente registrado.");
                }

                List<ReservationsModels> createdReservations = new ArrayList<>();
                for (int i = 0; i < reservationsList.size(); i++) {
                    ReservationsModels reservation = reservationsList.get(i);

                    if (i >= fieldIds.size()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("La cantidad de IDs de canchas no coincide con la cantidad de reservas.");
                    }

                    Long fieldId = fieldIds.get(i);
                    Optional<FieldModels> field = fieldRepository.findById(fieldId);
                    if (field.isPresent()) {
                        FieldModels fieldModel = field.get();

                        if (!fieldModel.getAdminModels().getId().equals(admin.get().getId())) {
                            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                    .body("Una de las canchas no pertenece a esta empresa.");
                        }

                        reservation.setFieldModels(fieldModel);

                        ReservationsModels newReservation = reservationsServices.createReservation(reservation);
                        createdReservations.add(newReservation);
                    } else {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cancha no encontrada para el ID " + fieldId);
                    }
                }

                return ResponseEntity.ok(createdReservations);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Administrador o cliente no encontrado.");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }


    //Consultar reserva por ID
    @GetMapping("/{id}")
    public ResponseEntity<ReservationsModels> getReservationById(@PathVariable("id") Long id) {
        return reservationsServices.getReservationById(id)
                .map(reservation -> new ResponseEntity<>(reservation, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    //consultar todas las reservas
    @GetMapping("/findAll")
    public List<ReservationsModels> findAll() {
        return reservationsServices.getAllReservations();
    }

    @GetMapping("/user")
    public ResponseEntity<List<Map<String, Object>>> getReservationsByUser(@RequestParam Long userId) {
        Optional<UserModels> user = userRepository.findById(userId);
        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        List<ReservationsModels> reservations = reservationsServices.getReservationsByUser(user.get());

        // Transformar cada reserva al formato esperado
        List<Map<String, Object>> formattedReservations = reservations.stream().map(reservation -> {
            Map<String, Object> formattedReservation = new HashMap<>();
            formattedReservation.put("id", reservation.getId());
            formattedReservation.put("cancha", reservation.getFieldModels().getNombre());
            formattedReservation.put("fechaPago", reservation.getFechaPago());
            formattedReservation.put(
                    "empresa",
                    reservation.getFieldModels().getAdminModels() != null
                            ? reservation.getFieldModels().getAdminModels().getNombreEmpresa()
                            : "N/A"
            );
            formattedReservation.put("fechaHoraInicio", reservation.getFechaHoraInicio());
            formattedReservation.put("fechaHoraFin", reservation.getFechaHoraFin());
            formattedReservation.put("costoTotal", String.format("$%,d", reservation.getCostoTotal()));
            formattedReservation.put("estado", reservation.getEstadoReserva());
            return formattedReservation;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(formattedReservations);
    }

    //consultar reservas de una empresa
    @GetMapping("/empresa")
    public ResponseEntity<List<ReservationsModels>> getReservationsByCompany(@RequestParam Long empresaId) {
        Optional<AdminModels> admin = companyRepository.findById(empresaId);
        if (!admin.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        List<ReservationsModels> reservations = reservationsServices.getReservationsByAdmin(admin.get());
        return ResponseEntity.ok(reservations);
    }

    //Consultar horarios de reservas por cancha segun fecha
    @GetMapping("/horarios/{idCancha}")
    public ResponseEntity<List<String>> obtenerHorariosReservados(
            @PathVariable Long idCancha, // Asegúrate de que sea Long
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        try {
            List<String> horariosReservados = reservationsServices.obtenerHorariosReservados(idCancha, fecha);
            return ResponseEntity.ok(horariosReservados);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    //actualizar reserva por ID
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

    //Eliminar reserva por ID
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