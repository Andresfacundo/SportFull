package com.example.sport_full.validations;

import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.IUserRepository;

public class UserValidations {
    private final IUserRepository userRepository;

    public UserValidations(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void validate(UserModels user) throws Exception {
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new Exception("El email no puede estar vacío");
        }
        if (user.getContraseña() == null || user.getContraseña().isEmpty()) {
            throw new Exception("La contraseña no puede estar vacía");
        }
        // Agrega más validaciones según sea necesario
    }
}

