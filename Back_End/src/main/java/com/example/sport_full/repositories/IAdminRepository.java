package com.example.sport_full.repositories;

import com.example.sport_full.models.AdminModels;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IAdminRepository extends JpaRepository<AdminModels, Integer> {
}
