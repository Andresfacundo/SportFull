package com.example.sport_full.controllers;


import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.ClientModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.IClientRepository;
import com.example.sport_full.repositories.IUserRepository;
import com.example.sport_full.services.ClientServices;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.Optional;
@CrossOrigin
@RestController
@RequestMapping("/client")
public class ClientControllers {

    @Autowired
    ClientServices clientServices;

    @Autowired
    IClientRepository clientRepository;

    @Autowired
    IUserRepository userRepository;

    @PostMapping
    public ClientModels createClient(@RequestBody ClientModels clientModels) {
        return this.clientServices.saveClient(clientModels);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<UserModels> findById(@PathVariable Long id) {
        Optional<ClientModels> cliente = this.clientRepository.findById(id);
        if (cliente.isPresent()) {
            ClientModels clientModels = cliente.get();
            UserModels user = clientModels.getUserModels();
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserModels> updateUser(@PathVariable("id") Long id, @RequestBody UserModels userModels) {
        Optional<UserModels> existingUser = this.userRepository.findById(id);
        if (existingUser.isPresent()) {
            ClientModels clientModels = userModels.getClientModels();
            UserModels updatedUser = this.clientServices.updateUserAndClient(userModels, clientModels, id);
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    // PRUEBA PATCH ACTUALIZACION PARCIAL
    @PatchMapping("/update/{id}")
    public ResponseEntity<UserModels> patchUpdateUser(@PathVariable("id") Long id, @RequestBody UserModels userModels) {
        Optional<UserModels> existingUserOpt = userRepository.findById(id);

        if (existingUserOpt.isPresent()) {
            UserModels existingUser = existingUserOpt.get();

            // Actualiza solo los campos que vienen en la solicitud, ignora los que sean null
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
                existingUser.setContraseña(hashedPassword) ;// Encripta la contraseña antes de guardarla
            }

            if (userModels.getClientModels() != null) {
                ClientModels clientModels = userModels.getClientModels();

                // Actualiza solo los campos de ClientModels que vienen
                if (clientModels.getTelefono() != null) {
                    existingUser.getClientModels().setTelefono(clientModels.getTelefono());
                }

                if (clientModels.getCC() != null) {
                    existingUser.getClientModels().setCC(clientModels.getCC());
                }
            }

            // Guarda los cambios en la base de datos
            userRepository.save(existingUser);
            return ResponseEntity.ok(existingUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<String> patchClient(@PathVariable("id") Long id) {
        if (this.userRepository.existsById(id)) {
            this.clientServices.patchClient(id);
            return ResponseEntity.status(HttpStatus.OK).build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteClient(@PathVariable("id") Long id) {
        if (this.userRepository.existsById(id)) {
            this.userRepository.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }
}