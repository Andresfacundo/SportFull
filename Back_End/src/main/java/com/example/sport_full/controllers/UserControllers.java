package com.example.sport_full.controllers;


import com.example.sport_full.Services.EmailService;
import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.ClientModels;
import com.example.sport_full.repositories.IClientRepository;
import com.example.sport_full.repositories.ICompanyRepository;
import com.example.sport_full.repositories.IUserRepository;
import com.example.sport_full.dto.LoginDTO;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.utils.TokenGenerator;
import com.example.sport_full.validations.UserValidations;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth")
public class UserControllers {
  private final IUserRepository userRepository;
  private final IClientRepository clientRepository;
  private final ICompanyRepository companyRepository;
  private final UserValidations userValidations;

  @Autowired
  private EmailService emailService; // Inyección del servicio de correo

  @Autowired
  public UserControllers(IUserRepository userRepository, IClientRepository clientRepository, ICompanyRepository companyRepository) {
    this.userRepository = userRepository;
    this.clientRepository = clientRepository;
    this.companyRepository = companyRepository;
    this.userValidations =  new UserValidations(userRepository);
  }
  @PostMapping("/register")
  public ResponseEntity<?> registry(@RequestBody UserModels userModels) {
    try {
      // Validar si el email ya existe
      Optional<UserModels> existingUser = userRepository.findByEmail(userModels.getEmail());
      if (existingUser.isPresent()) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("El email ya existe");
      }

      // Validaciones del usuario
      userValidations.validate(userModels);

      // Encriptar la contraseña
      String hashedPassword = BCrypt.hashpw(userModels.getContraseña(), BCrypt.gensalt());
      userModels.setContraseña(hashedPassword);

      // Generar un token de verificación
      String verificationToken = TokenGenerator.generateToken();
      userModels.setVerificationToken(verificationToken);
      userModels.setVerified(false); // Asegúrate de que el usuario no esté verificado aún

      // Guardar el usuario en la base de datos
      userRepository.save(userModels);

      // Enviar el correo de verificación
      emailService.sendVerificationEmail(userModels.getEmail(), verificationToken);

      // Validar el tipo de usuario y guardar en la tabla correspondiente
      if ("CLIENTE".equals(userModels.getTipoUsuario())) {
        ClientModels client = new ClientModels();
        client.setUserModels(userModels);
        clientRepository.save(client);
      } else if ("EMPRESA".equals(userModels.getTipoUsuario())) {
        AdminModels admin = new AdminModels();
        admin.setUserModels(userModels);
        companyRepository.save(admin);
      }

      // Retornar el modelo de usuario registrado
      return ResponseEntity.ok(userModels);
    } catch (Exception e) {
      // Manejar errores
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("Error en el registro: " + e.getMessage());
    }
  }

  @GetMapping("/verify")
  public ResponseEntity<String> verifyEmail(@RequestParam String token) {
    Optional<UserModels> userOptional = userRepository.findByVerificationToken(token);

    if (userOptional.isPresent()) {
      UserModels user = userOptional.get();
      user.setVerified(true);
      user.setVerificationToken(null); // Opcional: Limpiar el token después de la verificación
      userRepository.save(user);

      return ResponseEntity.ok("Correo verificado con éxito.");
    } else {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token de verificación inválido.");
    }
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
    if (loginDTO.getEmail() == null || loginDTO.getContraseña() == null) {
      return new ResponseEntity<>("Email o contraseña no pueden estar vacíos", HttpStatus.BAD_REQUEST);
    }

    Optional<UserModels> user = userRepository.findByEmail(loginDTO.getEmail());

    if (user.isPresent()) {
      UserModels foundUser = user.get();

      // Verificar si el correo ha sido verificado
      if (!foundUser.isVerified()) {
        return new ResponseEntity<>("Debes verificar tu correo antes de iniciar sesión.", HttpStatus.UNAUTHORIZED);
      }

      // Verificar la contraseña
      if (BCrypt.checkpw(loginDTO.getContraseña(), foundUser.getContraseña())) {
        return new ResponseEntity<>(foundUser, HttpStatus.OK);
      } else {
        return new ResponseEntity<>("Credenciales incorrectas", HttpStatus.UNAUTHORIZED);
      }
    } else {
      return new ResponseEntity<>("Credenciales incorrectas", HttpStatus.UNAUTHORIZED);
    }
  }

}
