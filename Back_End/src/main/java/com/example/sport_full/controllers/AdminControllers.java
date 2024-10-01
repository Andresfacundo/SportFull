package com.example.sport_full.controllers;


import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.ICompanyRepository;
import com.example.sport_full.repositories.IUserRepository;
import com.example.sport_full.services.AdminServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.mindrot.jbcrypt.BCrypt;


import java.util.List;
import java.util.Optional;
@CrossOrigin
@RestController
@RequestMapping("/admin")
public class AdminControllers {

    @Autowired
    ICompanyRepository companyRepository;

    @Autowired
    IUserRepository userRepository;

    @Autowired
    AdminServices adminServices;

    @PutMapping("/{id}")
    public ResponseEntity<UserModels> updateAdmin(@PathVariable("id") Long id, @RequestBody UserModels userModels) {
        Optional<UserModels> existingAdmin = this.userRepository.findById(id);
        if (existingAdmin.isPresent()) {
            AdminModels adminModels = userModels.getAdminModels();
            UserModels updatedUser = this.adminServices.updateAdminAndUser(adminModels, userModels, id);
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // PATCH actualización parcial
    @PatchMapping("/update/{id}")
    public ResponseEntity<UserModels> patchUpdateAdmin(@PathVariable("id") Long userId, @RequestBody UserModels userModels) {
        Optional<UserModels> existingUserOpt = userRepository.findById(userId);

        if (existingUserOpt.isPresent()) {
            UserModels existingUser = existingUserOpt.get();

            // Actualiza solo los campos de UserModels que vienen en la solicitud
            if (userModels.getNombres() != null) {
                existingUser.setNombres(userModels.getNombres());
            }

            if (userModels.getApellidos() != null) {
                existingUser.setApellidos(userModels.getApellidos());
            }

            if (userModels.getEmail() != null) {
                existingUser.setEmail(userModels.getEmail());
            }

            // Encripta la contraseña si se envía una nueva
            if (userModels.getContraseña() != null) {
                String hashedPassword = BCrypt.hashpw(userModels.getContraseña(), BCrypt.gensalt());
                existingUser.setContraseña(hashedPassword);
            }

            // Actualiza solo los campos de AdminModels que vienen en la solicitud
                if (userModels.getAdminModels() != null) {
                    AdminModels adminModels = userModels.getAdminModels();

                    if (adminModels.getNIT() != null) {
                        existingUser.getAdminModels().setNIT(adminModels.getNIT());
                    }

                    if (adminModels.getNombreEmpresa() != null) {
                        existingUser.getAdminModels().setNombreEmpresa(adminModels.getNombreEmpresa());
                    }

                    if (adminModels.getTelefonoEmpresa() != null) {
                        existingUser.getAdminModels().setTelefonoEmpresa(adminModels.getTelefonoEmpresa());
                    }

                    if (adminModels.getEmailEmpresa() != null) {
                        existingUser.getAdminModels().setEmailEmpresa(adminModels.getEmailEmpresa());
                    }

                    if (adminModels.getDireccionEmpresa() != null) {
                        existingUser.getAdminModels().setDireccionEmpresa(adminModels.getDireccionEmpresa());
                    }

                    if (adminModels.getCCpropietario() != null) {
                        existingUser.getAdminModels().setCCpropietario(adminModels.getCCpropietario());

                    }

                    if (adminModels.getTelefonoPropietario() != null) {
                        existingUser.getAdminModels().setTelefonoPropietario(adminModels.getTelefonoPropietario());
                    }

                    if (adminModels.getEmailPropietario() != null) {
                        existingUser.getAdminModels().setEmailPropietario(adminModels.getEmailPropietario());
                    }

                }
            // Guarda los cambios en la base de datos
            userRepository.save(existingUser);
            return ResponseEntity.ok(existingUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/find-all")
    public List<AdminModels> findAll() {
        return companyRepository.findAll();
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<UserModels> findById(@PathVariable("id") Long id) {
        Optional<UserModels> existingUser = this.adminServices.getUser(id);
        if (existingUser.isPresent()) {
            return ResponseEntity.ok(existingUser.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<String> patchAdmin(@PathVariable("id") Long id) {
        if (this.userRepository.existsById(id)) {
            this.adminServices.patchAdmin(id);
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable("id") Long id) {
        if (this.userRepository.existsById(id)) {
            this.userRepository.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }
}
