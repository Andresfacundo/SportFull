package com.example.sport_full.controllers;


import com.example.sport_full.config.JwtUtil;
import com.example.sport_full.dto.JwtResponse;
import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.ClientModels;
import com.example.sport_full.repositories.IClientRepository;
import com.example.sport_full.repositories.ICompanyRepository;
import com.example.sport_full.repositories.IUserRepository;
import com.example.sport_full.dto.LoginDTO;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.services.EmailServices;
import com.example.sport_full.services.VerificationsEmailServices;
import com.example.sport_full.validations.UserValidations;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth")
public class UserControllers {

  private final IUserRepository userRepository;
  private final IClientRepository clientRepository;
  private final ICompanyRepository companyRepository;
  private final UserValidations userValidations;
  private final JwtUtil jwtUtil;
  private final EmailServices emailService; // Asegúrate de agregar esto


  @Autowired
  public UserControllers(IUserRepository userRepository, IClientRepository clientRepository, ICompanyRepository companyRepository, JwtUtil jwtUtil, EmailServices emailService) {
      this.userRepository = userRepository;
      this.clientRepository = clientRepository;
      this.companyRepository = companyRepository;
      this.userValidations =  new UserValidations(userRepository);
    this.jwtUtil = jwtUtil;
      this.emailService = emailService;
  }


  @GetMapping("/find-all")
    public List<UserModels> getPrueba(){
      return  userRepository.findAll();
  }


    @PostMapping("/register")
    public ResponseEntity<?> registry(@RequestBody UserModels userModels) {
        try {
            // Validaciones del usuario
            userValidations.validate(userModels);

            // Encriptar la contraseña
            String hashedPassword = BCrypt.hashpw(userModels.getContraseña(), BCrypt.gensalt());
            userModels.setContraseña(hashedPassword);

            // Generar el token de verificación de correo electrónico
            String verificationToken = UUID.randomUUID().toString();
            userModels.setVerificationToken(verificationToken);
            userModels.setEmailVerified(false);

            // Guardar el usuario en la tabla 'usuarios'
            userRepository.save(userModels);

            // Validar el tipo de usuario y guardar en la tabla correspondiente
            if ("CLIENTE".equals(userModels.getTipoUsuario())) {
                ClientModels client = new ClientModels();
                client.setUserModels(userModels);

                // Establecer imagen predeterminada
                client.setImgPerfil(getDefaultImage("CLIENTE"));
                clientRepository.save(client);

            } else if ("EMPRESA".equals(userModels.getTipoUsuario())) {
                AdminModels admin = new AdminModels();
                admin.setUserModels(userModels);

                // Establecer imagen predeterminada
                admin.setImgPerfil(getDefaultImage("EMPRESA"));
                companyRepository.save(admin);
            }

            // Enviar el correo de verificación
            emailService.sendVerificationEmail(userModels.getEmail(), verificationToken);

            // Retornar el modelo de usuario registrado, pero sin contraseña
            userModels.setContraseña(null);
            return ResponseEntity.ok(userModels);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    //    Registrarse como invitado
    @PostMapping("/register-guest")
    public ResponseEntity<?> GuestRegistration(@RequestBody UserModels userModels) {
        try {
            // Validaciones del usuario
            userValidations.validate(userModels);

            // Asignar tipo de usuario por defecto como "CLIENTE"
            userModels.setTipoUsuario("CLIENTE");

            // Encriptar la contraseña
            String hashedPassword = BCrypt.hashpw(userModels.getContraseña(), BCrypt.gensalt());
            userModels.setContraseña(hashedPassword);

            // Generar el token de verificación de correo electrónico
            String verificationToken = UUID.randomUUID().toString();
            userModels.setVerificationToken(verificationToken);
            userModels.setEmailVerified(false);

            // Guardar el usuario en la tabla 'usuarios'
            userRepository.save(userModels);

            // Crear el modelo de cliente y guardar en la tabla 'clientes'
            ClientModels client = new ClientModels();
            client.setUserModels(userModels);

            // Establecer imagen predeterminada
            client.setImgPerfil(getDefaultImage("CLIENTE"));
            clientRepository.save(client);

            // Enviar el correo de verificación
            emailService.sendVerificationEmail(userModels.getEmail(), verificationToken);

            // Retornar el modelo de usuario registrado, pero sin contraseña
            userModels.setContraseña(null);
            return ResponseEntity.ok(userModels);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    private byte[] getDefaultImage(String userType) {
        try {
            String imagePath;
            if ("CLIENTE".equals(userType)) {
                imagePath = "src/main/resources/static/images/Perfil-Client.png";
            } else if ("EMPRESA".equals(userType)) {
                imagePath = "src/main/resources/static/images/perfil-Company.png";
            } else {
                throw new IllegalArgumentException("Tipo de usuario no válido");
            }

            // Leer el archivo y convertirlo a un arreglo de bytes
            Path path = Paths.get(imagePath);
            return Files.readAllBytes(path);

        } catch (IOException e) {
            throw new RuntimeException("Error al cargar la imagen predeterminada: " + e.getMessage());
        }
    }

    @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
    // Validar que el email y la contraseña no estén vacíos
    if (loginDTO.getEmail() == null || loginDTO.getContraseña() == null) {
      return new ResponseEntity<>("Email o contraseña no pueden estar vacíos", HttpStatus.BAD_REQUEST);
    }

    // Buscar el usuario por su email
    Optional<UserModels> userOptional = userRepository.findByEmail(loginDTO.getEmail());

    if (userOptional.isPresent()) {
      UserModels user = userOptional.get();

      // Validar si el correo ha sido verificado
      if (!user.isEmailVerified()) {
        return new ResponseEntity<>("El correo electrónico no ha sido verificado", HttpStatus.FORBIDDEN);
      }

      // Validar la contraseña
      if (BCrypt.checkpw(loginDTO.getContraseña(), user.getContraseña())) {
        // Generar el token JWT
        String jwt = jwtUtil.generateToken(user);

        // Crear un objeto de respuesta que incluya el JWT y la información del usuario
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("user", user); // Incluye toda la información del usuario

        return ResponseEntity.ok(response);
      } else {
        return new ResponseEntity<>("Credenciales incorrectas", HttpStatus.UNAUTHORIZED);
      }
    } else {
      return new ResponseEntity<>("Usuario no encontrado", HttpStatus.NOT_FOUND);
    }
  }
  @GetMapping("/verify")
  public ResponseEntity<?> verifyEmail(@RequestParam String token) {
    Optional<UserModels> userOptional = userRepository.findByVerificationToken(token);
    if (userOptional.isPresent()) {
      UserModels user = userOptional.get();
      user.setEmailVerified(true);
      userRepository.save(user);
      return ResponseEntity.ok("Correo verificado exitosamente.");
    }
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token de verificación inválido.");
  }


}

