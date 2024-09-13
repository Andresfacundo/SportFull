package com.example.sport_full.services;

import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.ICompanyRepository;
import com.example.sport_full.repositories.IUserRepository;
import com.example.sport_full.validations.AdminValidations;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
        AdminModels existingAdmin = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found")).getAdminModels();
        UserModels existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Client not found"));

        existingUser.setNombres(user.getNombres());
        existingUser.setApellidos(user.getApellidos());
        existingUser.setEmail(user.getEmail());
        if (user.getContraseña() == null ||
                !user.getContraseña().matches("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$")
        ){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        String hashedPassword = BCrypt.hashpw(user.getContraseña(), BCrypt.gensalt());
        user.setContraseña(hashedPassword);
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

    public Optional<UserModels> getUser(Long id) {
        return userRepository.findById(id);
    }

    public String patchAdmin(Long id) {
        Optional<UserModels> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            UserModels admin = optionalUser.get();
            admin.setEstadoCuenta(true);
            userRepository.save(admin);
            return "Admin con id " + id + " ha sido eliminado";

        }else{
            return "Admin con id " + id + " no existe";
        }
    }
}