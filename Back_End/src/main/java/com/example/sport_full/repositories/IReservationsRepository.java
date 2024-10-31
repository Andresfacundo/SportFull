package com.example.sport_full.repositories;

import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.FieldModels;
import com.example.sport_full.models.ReservationsModels;
import com.example.sport_full.models.UserModels;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IReservationsRepository extends JpaRepository<ReservationsModels,Long> {
    List<ReservationsModels> findByUserModels(UserModels userModels);
    List<ReservationsModels> findByFieldModels_AdminModels(AdminModels adminModels);

    boolean existsByFieldModelsAndFechaHoraInicioLessThanEqualAndFechaHoraFinGreaterThanEqual(
            FieldModels field,
            LocalDateTime fechaHoraFin,
            LocalDateTime fechaHoraInicio
    );

    boolean existsByFieldModelsAndFechaHoraInicioBetween(FieldModels field, LocalDateTime fechaHoraInicio, LocalDateTime fechaHoraFin);

    Optional<ReservationsModels> findTopByFieldModelsAndUserModelsOrderByFechaHoraInicioDesc(FieldModels fieldModel, UserModels userModels);
}
