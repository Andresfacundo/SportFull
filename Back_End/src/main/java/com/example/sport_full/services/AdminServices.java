package com.example.sport_full.services;

import com.example.sport_full.models.AdminModels;
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

    public String patchAdmin(Long id) {
        Optional<AdminModels> optionalAdmin = companyRepository.findById(id);
        if (optionalAdmin.isPresent()) {
            AdminModels admin = optionalAdmin.get();
            admin.setEstadoCuenta(true);
            companyRepository.save(admin);
            return "Admin con id " + id + " ha sido eliminado";

        }else{
            return "Admin con id " + id + " no existe";
        }
    }
}