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

    @PostMapping
    public ClientModels createClient(@RequestBody ClientModels clientModels) {
        return this.clientServices.saveClient(clientModels);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientModels> getClientProfile(@PathVariable Long id) {
        Optional<ClientModels> clientModels = clientServices.getClientById(id);
        return clientModels.map(models -> new ResponseEntity<>(models, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientModels> updateClient(@PathVariable("id") Long id, @RequestBody ClientModels clientModels) {
        Optional<ClientModels> existingClient = this.clientServices.getClientById(id);
        if (existingClient.isPresent()) {
            ClientModels updatedClientModels = this.clientServices.updateClient(clientModels, id);
            return ResponseEntity.ok(updatedClientModels);
        }else {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping(path = "/{id}")
    public String deleteClient(@PathVariable("id") Long id) {
        if(!clientServices.getClientById(id).isPresent()) {
            return "Error al eliminar el cliente";
        }else{
            boolean ok = this.clientServices.deleteClient(id);
            if(ok) {
                return "Cliente con id " + id + " eliminado";
            }else{
                return "Error al eliminar el cliente";
            }
        }
    }
}
