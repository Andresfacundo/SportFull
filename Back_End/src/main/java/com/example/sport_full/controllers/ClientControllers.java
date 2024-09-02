package com.example.sport_full.controllers;


import ch.qos.logback.core.net.server.Client;
import com.example.sport_full.models.ClientModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.IClientRepository;
import com.example.sport_full.repositories.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.Optional;

@RestController
@RequestMapping("/client")
public class ClientControllers {
    private final IUserRepository userRepository;
    private final IClientRepository clientRepository;


    @Autowired
    public ClientControllers(IUserRepository userRepository, IClientRepository clientRepository) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
    }

    @PostMapping("/register-client")
    public ResponseEntity<?> registerClient(@RequestBody ClientModels clientModels, UserModels userModels) {
        Optional<UserModels> userOptional = userRepository.findById(userModels.getId());

        if (userOptional.isPresent()) {
            UserModels user = userOptional.get();

            if (!"CLIENTE".equalsIgnoreCase(user.getTipoUsuario())) {
                return new ResponseEntity<>("El usuario no es de tipo CLIENTE", HttpStatus.BAD_REQUEST);
            }

            if (user.getClientModels() != null) {
                return new ResponseEntity<>("El usuario ya tiene un perfil de cliente asociado", HttpStatus.CONFLICT);
            }

            clientModels.setUserModels(user);
            ClientModels savedClient = clientRepository.save(clientModels);
            user.setClientModels(savedClient);
            userRepository.save(user);

            return new ResponseEntity<>(savedClient, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Usuario no encontrado", HttpStatus.NOT_FOUND);
        }
    }

}
