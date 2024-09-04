package com.example.sport_full.services;

import com.example.sport_full.models.ClientModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.IClientRepository;
import com.example.sport_full.repositories.IUserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ClientServices {

    @Autowired
    IClientRepository clientRepository;

    @Autowired
    IUserRepository userRepository;

    public ClientModels saveClient(ClientModels client) {
        return clientRepository.save(client);
    }

    public Optional<ClientModels> getClientById(Long id) {
        return clientRepository.findById(id);
    }

public UserModels updateUserAndClient(UserModels user, ClientModels client, Long id) {
    UserModels existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    ClientModels existingClient = clientRepository.findById(id).orElseThrow(() -> new RuntimeException("Client not found"));

    existingUser.setNombreCompleto(user.getNombreCompleto());
    existingUser.setEmail(user.getEmail());
    String hashedPassword = BCrypt.hashpw(user.getContraseña(), BCrypt.gensalt());
    user.setContraseña(hashedPassword);
    existingUser.setContraseña(user.getContraseña());

    existingClient.setCC(client.getCC());
    existingClient.setTelefono(client.getTelefono());

    clientRepository.save(existingClient);
    return userRepository.save(existingUser);
}

    public String patchClient(Long id) {
        Optional<ClientModels> optionalClient = clientRepository.findById(id);
        if (optionalClient.isPresent()) {
            ClientModels client = optionalClient.get();
            client.setEstadoCuenta(true);
            clientRepository.save(client);
            return "Cliente con id " + id + " ha sido eliminado";

        }else{
            return "Cliente con id " + id + " no existe";
        }
    }
}
