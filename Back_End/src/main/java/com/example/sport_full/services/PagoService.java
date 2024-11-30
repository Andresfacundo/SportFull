package com.example.sport_full.services;

import com.example.sport_full.models.Pago;
import com.example.sport_full.repositories.PagoRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PagoService {
    private final PagoRepository pagoRepository;

    public PagoService(PagoRepository pagoRepository) {
        this.pagoRepository = pagoRepository;
    }

}

