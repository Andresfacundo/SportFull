package com.example.sport_full.controllers;


import ch.qos.logback.core.net.server.Client;
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

    @PostMapping("/profile")
    public ClientModels createClient(@RequestBody ClientModels clientModels) {
        return this.clientServices.saveClient(clientModels);
    }

    @PutMapping(path = "/{id}")
    public ResponseEntity<ClientModels> updateClient(@PathVariable("id") Long id, @RequestBody ClientModels clientModels) {
        Optional<ClientModels> existingClient = this.clientServices.getClientById(id);
        if (existingClient.isPresent()) {
            ClientModels updatedClientModels = this.clientServices.updateClient(clientModels, id);
            return ResponseEntity.ok(updatedClientModels);
        }else {
            return ResponseEntity.notFound().build();
        }

    }
}
