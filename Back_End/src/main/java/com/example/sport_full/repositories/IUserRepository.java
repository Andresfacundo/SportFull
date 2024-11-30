package com.example.sport_full.repositories;

import com.example.sport_full.models.UserModels;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface IUserRepository extends JpaRepository<UserModels, Long> {
    Optional<UserModels> findByEmail(String email);

    // Nuevo método para buscar por token de verificación
    Optional<UserModels> findByVerificationToken(String verificationToken);

    boolean existsByEmail(String email);
}
