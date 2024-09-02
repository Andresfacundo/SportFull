package com.example.sport_full.controllers;

import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.IAdminRepository;
import com.example.sport_full.repositories.IUserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/empresa")
public class AdminControllers {

    @Autowired
    private IAdminRepository iAdminRepository;

    @Autowired
    private IUserRepository iUserRepository;

    // GET: Obtener todas las empresas
    @GetMapping
    public List<AdminModels> getAllEmpresas() {
        return iAdminRepository.findAll();
    }

    // GET: Obtener una empresa por ID
    @GetMapping("/{id}")
    public ResponseEntity<AdminModels> getEmpresaById(@PathVariable int id) {
        Optional<AdminModels> empresa = iAdminRepository.findById(id);
        return empresa.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST: Crear una nueva empresa con usuario/gestor
    @PostMapping
    public AdminModels createEmpresa(@RequestBody AdminModels adminModels) {
        // Encriptar la contraseña del usuario
        UserModels user = adminModels.getUserModels();
        if (user != null) {
            String hashedPassword = BCrypt.hashpw(user.getContraseña(), BCrypt.gensalt());
            user.setContraseña(hashedPassword);
            // No establecer la relación aquí para evitar ciclo infinito
            user = iUserRepository.save(user);
        }
        adminModels.setUserModels(user); // Asocia el usuario a la empresa
        return iAdminRepository.save(adminModels);
    }

    // PUT: Actualizar los detalles de una empresa
    @PutMapping("/{id}")
    public ResponseEntity<AdminModels> updateEmpresa(@PathVariable int id, @RequestBody AdminModels empresaDetails) {
        Optional<AdminModels> optionalEmpresa = iAdminRepository.findById(id);

        if (optionalEmpresa.isPresent()) {
            AdminModels empresa = optionalEmpresa.get();
            empresa.setNombreEmpresa(empresaDetails.getNombreEmpresa());
            empresa.setCedulaPropietario(empresaDetails.getCedulaPropietario());
            empresa.setTelefono(empresaDetails.getTelefono());
            empresa.setEmailEmpresa(empresaDetails.getEmailEmpresa());

            UserModels user = empresa.getUserModels();
            if (user != null) {
                user.setNombreCompleto(empresaDetails.getUserModels().getNombreCompleto());
                user.setEmail(empresaDetails.getUserModels().getEmail());

                // Encriptar la nueva contraseña si se proporciona
                if (empresaDetails.getUserModels().getContraseña() != null) {
                    String hashedPassword = BCrypt.hashpw(empresaDetails.getUserModels().getContraseña(), BCrypt.gensalt());
                    user.setContraseña(hashedPassword);
                }
                user.setTipoUsuario(empresaDetails.getUserModels().getTipoUsuario());
                iUserRepository.save(user);
            }

            iAdminRepository.save(empresa);
            return ResponseEntity.ok(empresa);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE: Eliminar una empresa por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmpresa(@PathVariable int id) {
        Optional<AdminModels> empresa = iAdminRepository.findById(id);

        if (empresa.isPresent()) {
            iAdminRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
