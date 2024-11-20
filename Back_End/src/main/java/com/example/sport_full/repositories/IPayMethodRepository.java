package com.example.sport_full.repositories;

import com.example.sport_full.models.PaymentMethodModels;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPayMethodRepository extends JpaRepository<PaymentMethodModels,Long> {
}
