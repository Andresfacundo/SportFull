package com.example.sport_full.services;

import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServices {
    @Autowired
    private IUserRepository userRepository;  // Inyectamos el repositorio de usuarios

    // Método para obtener un usuario por su ID
    public Optional<UserModels> getUser(Long userId) {
        return userRepository.findById(userId);
    }
}
