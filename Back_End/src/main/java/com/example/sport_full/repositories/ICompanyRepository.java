package com.example.sport_full.repositories;

import com.example.sport_full.models.AdminModels;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ICompanyRepository extends JpaRepository<AdminModels, Long> {
}