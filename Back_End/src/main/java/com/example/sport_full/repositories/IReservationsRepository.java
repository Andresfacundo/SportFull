package com.example.sport_full.repositories;

import com.example.sport_full.models.FieldModels;
import com.example.sport_full.models.ReservationsModels;
import com.example.sport_full.models.UserModels;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IReservationsRepository extends JpaRepository<ReservationsModels,Long> {


}
