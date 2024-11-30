package com.example.sport_full.services;

import com.example.sport_full.models.ClientModels;
import com.example.sport_full.models.GestorModels;
import com.example.sport_full.repositories.IGestorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
public class GestorServices {

    @Autowired
    private IGestorRepository igestorRepository;

    public GestorModels saveGestor(GestorModels gestor) {
        // Asegúrate de que gestor.userModels esté configurado correctamente antes de guardar
        return igestorRepository.save(gestor);
    }

    public GestorModels updateGestor(GestorModels gestorDetails, Long id) {
        return igestorRepository.findById(id)
                .map(gestor -> {
                    gestor.setCCgestor(gestorDetails.getCCgestor());
                    gestor.setTelefono(gestorDetails.getTelefono());
                    gestor.setAdminModels(gestorDetails.getAdminModels());
                    gestor.setUserModels(gestorDetails.getUserModels()); // Asegúrate de incluir esta línea
                    return igestorRepository.save(gestor);
                })
                .orElseThrow(() -> new RuntimeException("Gestor not found with id " + id));
    }

    public GestorModels getGestorById(Long id) {
        // Devuelve el gestor junto con sus relaciones
        return igestorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gestor not found with id " + id));
    }

    public void actualizarImagenGestor(GestorModels gestor, byte[] imagenBytes) {
        // Actualizar la imagen en el modelo de la empresa
        gestor.setImgPerfil(imagenBytes);

        // Guardar los cambios en la base de datos
        igestorRepository.save(gestor);
    }
}
