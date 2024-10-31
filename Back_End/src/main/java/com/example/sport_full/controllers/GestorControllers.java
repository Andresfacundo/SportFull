package com.example.sport_full.controllers;

import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.GestorModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.ICompanyRepository;
import com.example.sport_full.repositories.IGestorRepository;
import com.example.sport_full.repositories.IUserRepository;
import com.example.sport_full.services.EmailServices;
import com.example.sport_full.validations.UserValidations;
import jakarta.transaction.Transactional;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
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
    
    // Crear un nuevo Gestor, solo por un administrador
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
            gestorModels.setUserModels(userModels);
            gestorModels.setAdminempresa(empresa.get());

            // Guardar el gestor en la tabla de gestores
            gestorRepository.save(gestorModels);

            // Enviar el correo de verificación
            emailService.sendVerificationEmail(userModels.getEmail(), verificationToken);

            // Retornar el modelo de usuario registrado (sin mostrar la contraseña)
            userModels.setContraseña(null);
            return ResponseEntity.ok(userModels);

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

    // Actualizar un gestor
    @PatchMapping("/update/{id}")
    public ResponseEntity<GestorModels> patchUpdateGestor(@PathVariable("id") Long id, @RequestBody Map<String, Object> requestData) {
        // Buscar el usuario en la tabla de usuarios en base al ID
        Optional<UserModels> existingUserOpt = userRepository.findById(id);

        if (existingUserOpt.isPresent()) {
            UserModels existingUser = existingUserOpt.get();

            // Si existe un perfil de gestor asociado, se actualiza
            GestorModels existingGestor = existingUser.getGestorModels();
            if (existingGestor == null) {
                return ResponseEntity.badRequest().body(null); // No hay perfil de gestor asociado
            }

            // Actualizar los datos del UserModels (email, nombres, apellidos, contraseña)
            if (requestData.containsKey("email")) {
                existingUser.setEmail((String) requestData.get("email"));
            }

            if (requestData.containsKey("nombres")) {
                existingUser.setNombres((String) requestData.get("nombres"));
            }

            if (requestData.containsKey("apellidos")) {
                existingUser.setApellidos((String) requestData.get("apellidos"));
            }

            // Encripta la nueva contraseña si se envía
            if (requestData.containsKey("contraseña")) {
                String hashedPassword = BCrypt.hashpw((String) requestData.get("contraseña"), BCrypt.gensalt());
                existingUser.setContraseña(hashedPassword);
            }

            // Actualizar los datos del perfil del gestor
            if (requestData.containsKey("gestorModels")) {
                Map<String, Object> gestorData = (Map<String, Object>) requestData.get("gestorModels");

                if (gestorData.containsKey("ccgestor")) {
                    existingGestor.setCCgestor((String) gestorData.get("ccgestor"));
                }

                if (gestorData.containsKey("telefono")) {
                    existingGestor.setTelefono((String) gestorData.get("telefono"));
                }
            }

            // Guardar los cambios tanto en el perfil de usuario como en el gestor
            userRepository.save(existingUser); // Guardar los cambios en UserModels
            gestorRepository.save(existingGestor); // Guardar los cambios en GestorModels
            return ResponseEntity.ok(existingGestor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar un gestor y su usuario asociado
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGestor(@PathVariable("id") Long id) {
        // Verificar si el gestor existe
        Optional<GestorModels> gestorOptional = gestorRepository.findById(id);

        if (gestorOptional.isPresent()) {
            GestorModels gestor = gestorOptional.get();

            // Eliminar el gestor
            gestorRepository.delete(gestor);

            // Eliminar el usuario asociado
            UserModels user = gestor.getUserModels();
            if (user != null) {
                userRepository.delete(user);
            }

            return ResponseEntity.status(HttpStatus.OK).body("Gestor y usuario eliminados exitosamente.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
