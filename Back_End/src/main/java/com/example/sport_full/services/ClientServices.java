package com.example.sport_full.services;

import com.example.sport_full.models.ClientModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.IClientRepository;
import com.example.sport_full.repositories.IUserRepository;
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

    public ClientModels updateClient(ClientModels request, Long id) {
        ClientModels clientOptional = clientRepository.findById(id).get();

        clientOptional.setCC(request.getCC());
        clientOptional.setTelefono(request.getTelefono());
        return clientRepository.save(clientOptional);
    }

    public boolean deleteClient(Long id) {
        try {
            clientRepository.deleteById(id);
            userRepository.deleteById(id);
            return true;
        }catch (Exception e){
            return false;
        }

    }
}
