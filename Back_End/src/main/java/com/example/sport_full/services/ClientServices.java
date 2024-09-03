package com.example.sport_full.services;

import com.example.sport_full.models.ClientModels;
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
