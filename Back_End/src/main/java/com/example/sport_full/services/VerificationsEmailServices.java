package com.example.sport_full.services;

import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service

public class VerificationsEmailServices {
    @Autowired
    private IUserRepository userRepository;

    public boolean verifyEmail(String token) {
        Optional<UserModels> userOptional = userRepository.findByVerificationToken(token);
        if (userOptional.isPresent()) {
            UserModels user = userOptional.get();
            user.setEmailVerified(true);  // Marcar el correo como verificado
            user.setVerificationToken(null);  // Eliminar el token ya que fue utilizado
            userRepository.save(user);  // Guardar los cambios
            return true;
        }
        return false;  // Token inválido o expirado
    }

}
