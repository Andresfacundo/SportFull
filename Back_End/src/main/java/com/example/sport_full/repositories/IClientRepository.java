package com.example.sport_full.repositories;

import com.example.sport_full.models.ClientModels;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface IClientRepository extends JpaRepository<ClientModels, Long> {
}
