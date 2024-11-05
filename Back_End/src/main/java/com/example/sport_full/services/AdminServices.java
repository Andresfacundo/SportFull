package com.example.sport_full.services;

import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.ICompanyRepository;
import com.example.sport_full.repositories.IUserRepository;
import com.example.sport_full.validations.AdminValidations;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;


@Service
public class AdminServices {

    @Autowired
    ICompanyRepository companyRepository;

    @Autowired
    IUserRepository userRepository;

    @Autowired
    AdminValidations AdminValidations;

    public UserModels updateAdminAndUser(AdminModels admin, UserModels user, Long id) {
        AdminModels existingAdmin = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found")).getAdminModels();
        UserModels existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Client not found"));

        existingUser.setNombres(user.getNombres());
        existingUser.setApellidos(user.getApellidos());
        existingUser.setEmail(user.getEmail());
        if (user.getContraseña() == null ||
                !user.getContraseña().matches("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$")
        ) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        String hashedPassword = BCrypt.hashpw(user.getContraseña(), BCrypt.gensalt());
        user.setContraseña(hashedPassword);
        existingUser.setContraseña(user.getContraseña());

        existingAdmin.setNIT(admin.getNIT());
        existingAdmin.setNombreEmpresa(admin.getNombreEmpresa());
        existingAdmin.setTelefonoEmpresa(admin.getTelefonoEmpresa());
        existingAdmin.setEmailEmpresa(admin.getEmailEmpresa());
        existingAdmin.setDireccionEmpresa(admin.getDireccionEmpresa());
        existingAdmin.setCCpropietario(admin.getCCpropietario());
        existingAdmin.setTelefonoPropietario(admin.getTelefonoPropietario());

        companyRepository.save(existingAdmin);
        return userRepository.save(existingUser);
    }

    public Optional<UserModels> getUser(Long id) {
        return userRepository.findById(id);
    }

    public String patchAdmin(Long id) {
        Optional<UserModels> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            UserModels admin = optionalUser.get();
            admin.setEstadoCuenta(true); // Cambiar a inactivo
            admin.setFechaInhabilitacion(LocalDateTime.now()); // Guardar la fecha de inhabilitación
            userRepository.save(admin);

            // Programar la eliminación del usuario después del tiempo límite
            scheduleAccountDeletion(admin);

            return "Admin con id " + id + " ha sido inhabilitado. Tiene 30 segundos para reactivar su cuenta.";
        } else {
            return "Admin con id " + id + " no existe";
        }
    }

    // Método para programar la eliminación del usuario si no reactiva la cuenta
    private void scheduleAccountDeletion(UserModels user) {
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        long delay = user.getTiempoLimiteReactivacion(); // Tiempo en minutos

        // Programar la tarea para ejecutar después de 'delay' minutos
        scheduler.schedule(() -> {
            Optional<UserModels> optionalUser = userRepository.findById(user.getId());
            if (optionalUser.isPresent()) {
                UserModels currentUser = optionalUser.get();
                // Verificar si la cuenta sigue inactiva
                if (currentUser.isEstadoCuenta()) { // Si sigue inactivo (TRUE)
                    userRepository.delete(currentUser); // Eliminar la cuenta
                }
            }
        }, delay, TimeUnit.SECONDS);
    }

    public void actualizarHorario(AdminModels empresa, LocalTime horaApertura, LocalTime horaCierre) {
        if (horaApertura.isAfter(horaCierre)) {
            throw new IllegalArgumentException("La hora de apertura debe ser antes de la hora de cierre.");
        }
        empresa.setHoraApertura(horaApertura);
        empresa.setHoraCierre(horaCierre);
        // Aquí se guardarían los cambios en la base de datos
    }

    public boolean validarDisponibilidad(AdminModels empresa, LocalTime horaReserva) {
        return !horaReserva.isBefore(empresa.getHoraApertura()) && !horaReserva.isAfter(empresa.getHoraCierre());
    }
}