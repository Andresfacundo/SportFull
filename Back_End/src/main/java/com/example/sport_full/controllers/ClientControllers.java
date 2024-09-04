package com.example.sport_full.controllers;


import com.example.sport_full.models.ClientModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.IClientRepository;
import com.example.sport_full.repositories.IUserRepository;
import com.example.sport_full.services.ClientServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.Optional;

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
        Optional<UserModels> user = this.userRepository.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
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
    @PatchMapping("/{id}")
    public ResponseEntity<String> patchClient(@PathVariable("id") Long id) {
        if (this.clientRepository.existsById(id)) {
            this.clientServices.patchClient(id);
            return ResponseEntity.status(HttpStatus.OK).build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }
}