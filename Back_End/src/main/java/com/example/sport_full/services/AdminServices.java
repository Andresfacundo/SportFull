package com.example.sport_full.services;

import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.ICompanyRepository;
import com.example.sport_full.repositories.IUserRepository;
import com.example.sport_full.validations.AdminValidations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class AdminServices {

  @Autowired
  ICompanyRepository companyRepository;

    @Autowired
    IUserRepository userRepository;

    @Autowired
    AdminValidations AdminValidations;

    public UserModels updateAdminAndUser(AdminModels admin, UserModels user, Long id) {
        AdminModels existingAdmin = companyRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        UserModels existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Client not found"));

        existingUser.setNombreCompleto(user.getNombreCompleto());
        existingUser.setEmail(user.getEmail());
        existingUser.setContraseña(user.getContraseña());

        existingAdmin.setNIT(admin.getNIT());
        existingAdmin.setNombreEmpresa(admin.getNombreEmpresa());
        existingAdmin.setTelefonoEmpresa(admin.getTelefonoEmpresa());
        existingAdmin.setEmailEmpresa(admin.getEmailEmpresa());
        existingAdmin.setDireccionEmpresa(admin.getDireccionEmpresa());
        existingAdmin.setCCpropietario(admin.getCCpropietario());
        existingAdmin.setTelefonoPropietario(admin.getTelefonoPropietario());
        existingAdmin.setEmailPropietario(admin.getEmailPropietario());

        companyRepository.save(existingAdmin);
        return userRepository.save(existingUser);
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