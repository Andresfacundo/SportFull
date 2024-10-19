package com.example.sport_full.validations;

import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service // O puedes usar @Service si lo prefieres
public class UserValidations {

    private final IUserRepository userRepository;

    @Autowired
    public UserValidations(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void validate(UserModels userModels) {
        // Validación de email existente
        Optional<UserModels> existingUser = userRepository.findByEmail(userModels.getEmail());
        if (existingUser.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya existe");
        }

        // Validación de la contraseña
        if (userModels.getContraseña() == null ||
                !userModels.getContraseña().matches("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$")
        ){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña no cumple con los requisitos.");
        }

    }
}
