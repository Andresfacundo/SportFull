package com.example.sport_full.controllers;

import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.ClientModels;
import com.example.sport_full.models.GestorModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.ICompanyRepository;
import com.example.sport_full.repositories.IGestorRepository;
import com.example.sport_full.repositories.IUserRepository;
import com.example.sport_full.services.EmailServices;
import com.example.sport_full.services.GestorServices;
import com.example.sport_full.validations.UserValidations;
import jakarta.transaction.Transactional;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@CrossOrigin
@RestController
@RequestMapping("/admin/gestor")
public class GestorControllers {

    @Autowired
    private IGestorRepository gestorRepository;

    @Autowired
    private ICompanyRepository companyRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private EmailServices emailService;  // Servicio de correo

    @Autowired
    private UserValidations userValidations;  // Validaciones del usuario
    @Autowired
    private GestorServices gestorServices;

    @PostMapping("/register")
    public ResponseEntity<?> createGestor(@RequestBody Map<String, Object> requestData, @RequestParam Long adminEmpresa_Id) {
        try {
            // Extraer los datos del usuario
            String email = (String) requestData.get("email");
            String nombres = (String) requestData.get("nombres");
            String apellidos = (String) requestData.get("apellidos");
            String contraseña = (String) requestData.get("contraseña");

            // Extraer datos del gestor
            Map<String, String> gestorData = (Map<String, String>) requestData.get("gestorModels");
            String ccgestor = gestorData.get("ccgestor");
            String telefono = gestorData.get("telefono");

            // Buscar la empresa a la que se va a asociar el gestor
            Optional<AdminModels> empresa = companyRepository.findById(adminEmpresa_Id);
            if (!empresa.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La empresa no existe.");
            }

            // Verificar si el email ya está en uso
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El correo ya está en uso.");
            }

            // Verificar si el ccgestor ya está en uso
            if (gestorRepository.existsByCCgestor(ccgestor)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La cédula ya está registrada.");
            }

            // Verificar si el teléfono ya está en uso
            if (gestorRepository.existsByTelefono(telefono)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El teléfono ya está en uso.");
            }

            // Crear un nuevo objeto UserModels
            UserModels userModels = new UserModels();
            userModels.setEmail(email);
            userModels.setNombres(nombres);
            userModels.setApellidos(apellidos);

            // Encriptar la contraseña
            String hashedPassword = BCrypt.hashpw(contraseña, BCrypt.gensalt());
            userModels.setContraseña(hashedPassword);

            // Generar el token de verificación de correo electrónico
            String verificationToken = UUID.randomUUID().toString();
            userModels.setVerificationToken(verificationToken);
            userModels.setEmailVerified(false); // Correo no verificado

            // Establecer el tipo de usuario como "GESTOR"
            userModels.setTipoUsuario("GESTOR");

            // Guardar el usuario en la tabla 'usuarios'
            userRepository.save(userModels);

            // Crear un nuevo objeto GestorModels
            GestorModels gestorModels = new GestorModels();
            gestorModels.setCCgestor(ccgestor);
            gestorModels.setTelefono(telefono);
            gestorModels.setUserModels(userModels);  // Asociar el gestor con el usuario
            gestorModels.setAdminModels(empresa.get()); // Asociar el gestor con la empresa

            // Guardar el gestor en la tabla de gestores
            gestorRepository.save(gestorModels);

            // Enviar el correo de verificación
            emailService.sendVerificationEmail(userModels.getEmail(), verificationToken);

            // Eliminar la contraseña del modelo de respuesta
            userModels.setContraseña(null);

            // Crear un objeto que contenga la estructura que necesitas
            Map<String, Object> response = new HashMap<>();
            response.put("id", gestorModels.getId());
            response.put("telefono", gestorModels.getTelefono());
            response.put("ccgestor", gestorModels.getCCgestor());

            // Crear la estructura 'userModels' dentro de la respuesta
            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("id", userModels.getId());
            userResponse.put("nombres", userModels.getNombres());
            userResponse.put("apellidos", userModels.getApellidos());
            userResponse.put("email", userModels.getEmail());
            userResponse.put("contraseña", userModels.getContraseña());
            userResponse.put("tipoUsuario", userModels.getTipoUsuario());
            userResponse.put("fechaInhabilitacion", userModels.getFechaInhabilitacion());
            userResponse.put("tiempoLimiteReactivacion", userModels.getTiempoLimiteReactivacion());
            userResponse.put("estadoCuenta", userModels.isEstadoCuenta());
            userResponse.put("emailVerified", userModels.isEmailVerified());
            userResponse.put("verificationToken", userModels.getVerificationToken());

            // Incluir el 'userModels' dentro de la respuesta final
            response.put("userModels", userResponse);

            // Retornar la respuesta con la estructura completa
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    // Obtener un gestor por ID
    @GetMapping("/find/{id}")
    public ResponseEntity<GestorModels> findById(@PathVariable Long id) {
        Optional<GestorModels> gestor = gestorRepository.findById(id);
        return gestor.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Obtener todos los gestores
    @GetMapping("/find-all")
    public List<GestorModels> findAll() {
        return gestorRepository.findAll();
    }

    // Método para actualizar la imagen de perfil de la empresa
    @PostMapping("/actualizar-imagen/{gestorId}")
    public ResponseEntity<?> actualizarImagenGestor(@PathVariable("gestorId") Long gestorId,
                                                     @RequestParam("imgPerfil") MultipartFile imgPerfil) {
        try {
            // Buscar la empresa en la base de datos
            GestorModels gestor = gestorRepository.findById(gestorId)
                    .orElseThrow(() -> new RuntimeException("Gestor no encontrado"));

            // Convertir la imagen a bytes
            byte[] imagenBytes = imgPerfil.getBytes();

            // Actualizar la imagen de perfil en el servicio
            gestorServices.actualizarImagenGestor(gestor, imagenBytes);

            return ResponseEntity.ok("Imagen de perfil del gestor actualizado correctamente.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al cargar la imagen.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Actualizar un gestor
    @PatchMapping("/update/{id}")
    public ResponseEntity<GestorModels> patchUpdateGestor(@PathVariable("id") Long id, @RequestBody Map<String, Object> requestData) {
        // Buscar el gestor en la tabla de gestores por el ID
        Optional<GestorModels> existingGestorOpt = gestorRepository.findById(id);

        if (existingGestorOpt.isPresent()) {
            GestorModels existingGestor = existingGestorOpt.get();
            UserModels existingUser = existingGestor.getUserModels(); // Obtener el usuario asociado al gestor

            // Actualizar los datos del perfil de gestor
            if (requestData.containsKey("gestorModels")) {
                Map<String, Object> gestorData = (Map<String, Object>) requestData.get("gestorModels");

                if (gestorData.containsKey("ccgestor")) {
                    existingGestor.setCCgestor((String) gestorData.get("ccgestor"));
                }

                if (gestorData.containsKey("telefono")) {
                    existingGestor.setTelefono((String) gestorData.get("telefono"));
                }
            }

            // Actualizar los datos del usuario (si se envían)
            if (requestData.containsKey("email")) {
                existingUser.setEmail((String) requestData.get("email"));
            }

            if (requestData.containsKey("nombres")) {
                existingUser.setNombres((String) requestData.get("nombres"));
            }

            if (requestData.containsKey("apellidos")) {
                existingUser.setApellidos((String) requestData.get("apellidos"));
            }

            // Encriptar la nueva contraseña si se envía
            if (requestData.containsKey("contraseña")) {
                String hashedPassword = BCrypt.hashpw((String) requestData.get("contraseña"), BCrypt.gensalt());
                existingUser.setContraseña(hashedPassword);
            }

            // Guardar los cambios tanto en el perfil de usuario como en el gestor
            userRepository.save(existingUser); // Guardar los cambios en UserModels
            gestorRepository.save(existingGestor); // Guardar los cambios en GestorModels

            return ResponseEntity.ok(existingGestor);
        } else {
            return ResponseEntity.notFound().build(); // Si no se encuentra el gestor
        }
    }

    // Eliminar un gestor y su usuario asociado
    @DeleteMapping("/{gestorId}")
    public ResponseEntity<String> deleteGestor(@PathVariable("gestorId") Long gestorId) {
        // Verificar si el gestor existe
        Optional<GestorModels> gestorOptional = gestorRepository.findById(gestorId);

        if (gestorOptional.isPresent()) {
            GestorModels gestor = gestorOptional.get();

            // Eliminar el gestor
            gestorRepository.delete(gestor);

            // Obtener y eliminar el usuario asociado al gestor
            if (gestor.getUserModels() != null) {
                UserModels user = gestor.getUserModels();
                userRepository.delete(user);
            }

            return ResponseEntity.status(HttpStatus.OK).body("Gestor y usuario eliminados exitosamente.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Gestor no encontrado.");
        }
    }

}
