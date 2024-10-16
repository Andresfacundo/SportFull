package com.example.sport_full.repositories;

import com.example.sport_full.models.FieldModels;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IFieldRepository extends JpaRepository<FieldModels, Long> {
    List<FieldModels> findByAdminModels_Id(Long empresaId);
    List<FieldModels> findByNombreContainingIgnoreCase(String nombre);
}
