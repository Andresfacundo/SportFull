package com.example.sport_full.services;

import com.example.sport_full.models.GestorModels;
import com.example.sport_full.repositories.IGestorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GestorServices {

    @Autowired
    IGestorRepository igestorRepository;


    public GestorModels saveGestor(GestorModels gestor) {
        return igestorRepository.save(gestor);
    }

    public GestorModels updateGestor(GestorModels gestorDetails, Long id) {
        return igestorRepository.findById(id)
                .map(gestor -> {
                    gestor.setCCgestor(gestorDetails.getCCgestor());
                    gestor.setTelefono(gestorDetails.getTelefono());
                    gestor.setAdminempresa(gestorDetails.getAdminempresa());
                    return igestorRepository.save(gestor);
                })
                .orElseThrow(() -> new RuntimeException("Gestor not found with id " + id));
    }
}
