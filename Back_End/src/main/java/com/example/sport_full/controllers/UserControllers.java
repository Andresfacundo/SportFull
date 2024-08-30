package com.example.sport_full.controllers;


import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.ClientModels;
import com.example.sport_full.repositories.IClientRepository;
import com.example.sport_full.repositories.ICompanyRepository;
import com.example.sport_full.repositories.IUserRepository;
import com.example.sport_full.dto.LoginDTO;
import com.example.sport_full.models.UserModels;
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
  public UserControllers(IUserRepository userRepository, IClientRepository clientRepository, ICompanyRepository companyRepository) {
      this.userRepository = userRepository;
      this.clientRepository = clientRepository;
      this.companyRepository = companyRepository;
      this.userValidations =  new UserValidations(userRepository);
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

      // Guardar el usuario en la tabla 'usuarios'
      userRepository.save(userModels);

      // Validar el tipo de usuario y guardar en la tabla correspondiente
      if ("CLIENTE".equals(userModels.getTipoUsuario())) {
        ClientModels client = new ClientModels();
        client.setUserModels(userModels);
        // Configura otros atributos de `client` si es necesario
        clientRepository.save(client);
      } else if ("EMPRESA".equals(userModels.getTipoUsuario())) {
        AdminModels admin = new AdminModels();
        admin.setUserModels(userModels);
        // Configura otros atributos de `admin` si es necesario
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

@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
  if (loginDTO.getEmail() == null || loginDTO.getContraseña() == null) {
    return new ResponseEntity<>("Email o contraseña no pueden estar vacíos", HttpStatus.BAD_REQUEST);
  }
  Optional<UserModels> user = userRepository.findByEmail(loginDTO.getEmail());
  if (user.isPresent() && BCrypt.checkpw(loginDTO.getContraseña(), user.get().getContraseña())) {
    return new ResponseEntity<>(user.get(), HttpStatus.OK);
  } else {
    return new ResponseEntity<>("Credenciales incorrectas", HttpStatus.UNAUTHORIZED);
  }
}

}
