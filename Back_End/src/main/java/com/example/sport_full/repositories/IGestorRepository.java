package com.example.sport_full.repositories;

import com.example.sport_full.models.GestorModels;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IGestorRepository extends JpaRepository<GestorModels, Long> {
    boolean existsByCCgestor(String ccgestor);

    boolean existsByTelefono(String telefono);
}
