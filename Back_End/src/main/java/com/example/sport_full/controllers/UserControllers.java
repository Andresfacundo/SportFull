package com.example.sport_full.controllers;


import com.example.sport_full.repositories.IUserRepository;
import com.example.sport_full.dto.LoginDTO;
import com.example.sport_full.models.UserModels;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth")
public class UserControllers {
  private final IUserRepository userRepository;

  @Autowired
  public UserControllers(IUserRepository userRepository) {
      this.userRepository = userRepository;
  }

  @GetMapping("/find-all")
    public List<UserModels> getPrueba(){
      return  userRepository.findAll();
  }

  @PostMapping("/register")
  public UserModels registry(@RequestBody UserModels userModels){
    Optional<UserModels> existingUser = userRepository.findByEmail(userModels.getEmail());
    if(existingUser.isPresent()){
      throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya existe");
    }
    String hashedPassword = BCrypt.hashpw(userModels.getContraseña(), BCrypt.gensalt());
    userModels.setContraseña(hashedPassword);
    return userRepository.save(userModels);
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
