package com.example.sport_full.services;

import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.ICompanyRepository;
import com.example.sport_full.validations.AdminValidations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;


@Service
public class AdminServices {

  @Autowired
  ICompanyRepository companyRepository;

    @Autowired
    AdminValidations AdminValidations;

    public AdminModels updateAdmin(AdminModels adminModels, Long id) {
        return companyRepository.findById(id)
                .map(admin -> {
                    if (adminModels.getNIT() != null) {
                        admin.setNIT(adminModels.getNIT());
                    }
                    if (adminModels.getCCpropietario() != null) {
                        admin.setCCpropietario(adminModels.getCCpropietario());
                    }
                    admin.setNombreEmpresa(adminModels.getNombreEmpresa());
                    admin.setTelefonoEmpresa(adminModels.getTelefonoEmpresa());
                    admin.setEmailEmpresa(adminModels.getEmailEmpresa());
                    admin.setDireccionEmpresa(adminModels.getDireccionEmpresa());
                    admin.setTelefonoPropietario(adminModels.getTelefonoPropietario());
                    admin.setEmailPropietario(adminModels.getEmailPropietario());
                    return companyRepository.save(admin);
                })
                .orElseThrow(() -> new IllegalArgumentException("Admin not found with id: " + id));
    }

    public Optional<AdminModels> getAdmin(Long id) {
        return companyRepository.findById(id);
    }

    public AdminModels patchAdmin(Long id, Map<String, Object> updates) {
        return companyRepository.findById(id)
                .map(admin -> {
                    updates.forEach((key, value) -> {
                        switch (key) {
                            case "NIT" -> admin.setNIT((String) value);
                            case "nombreEmpresa" -> admin.setNombreEmpresa((String) value);
                            case "telefonoEmpresa" -> admin.setTelefonoEmpresa((String) value);
                            case "emailEmpresa" -> admin.setEmailEmpresa((String) value);
                            case "direccionEmpresa" -> admin.setDireccionEmpresa((String) value);
                            case "CCpropietario" -> admin.setCCpropietario((String) value);
                            case "telefonoPropietario" -> admin.setTelefonoPropietario((String) value);
                            case "emailPropietario" -> admin.setEmailPropietario((String) value);
                            case "userModels" -> admin.setUserModels((UserModels) value);
                        }
                    });
                    AdminValidations.patchAdmin(admin);
                    return companyRepository.save(admin);
                })
                .orElseThrow(() -> new IllegalArgumentException("Admin not found with id: " + id));
    }
}