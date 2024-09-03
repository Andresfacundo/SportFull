package com.example.sport_full.services;

import com.example.sport_full.models.AdminModels;
import com.example.sport_full.repositories.ICompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class AdminServices {

  @Autowired
  ICompanyRepository companyRepository;

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

    public void deleteAdmin(Long id) {
        if (companyRepository.existsById(id)) {
            companyRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Admin not found with id: " + id);
        }
    }
}
