package com.example.sport_full.validations;

import com.example.sport_full.models.AdminModels;
import org.springframework.stereotype.Component;

@Component
public class AdminValidations {

    public AdminModels patchAdmin(AdminModels adminModels) {
        // Dejar el id en cero (0) para que quede "vacío"
        adminModels.setId(0);

        // Dejar el userModels en null
        adminModels.setUserModels(null);
        if (adminModels.getNIT() == null) {
            adminModels.setNIT("");
        }
        if (adminModels.getNombreEmpresa() == null) {
            adminModels.setNombreEmpresa("");
        }
        if (adminModels.getTelefonoEmpresa() == null) {
            adminModels.setTelefonoEmpresa("");
        }
        if (adminModels.getEmailEmpresa() == null) {
            adminModels.setEmailEmpresa("");
        }
        if (adminModels.getDireccionEmpresa() == null) {
            adminModels.setDireccionEmpresa("");
        }
        if (adminModels.getCCpropietario() == null) {
            adminModels.setCCpropietario("");
        }
        if (adminModels.getTelefonoPropietario() == null) {
            adminModels.setTelefonoPropietario("");
        }
        if (adminModels.getEmailPropietario() == null) {
            adminModels.setEmailPropietario("");
        }
        return adminModels;
    }
}