package com.example.sport_full.services;

import com.example.sport_full.models.ClientModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.IClientRepository;
import com.example.sport_full.repositories.IUserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

    public Optional<UserModels> getClient(Long id) {
        return userRepository.findById(id);
    }

public UserModels updateUserAndClient(UserModels user, ClientModels client, Long id) {
    UserModels existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    ClientModels existingClient = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Client not found")).getClientModels();

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

    existingClient.setCC(client.getCC());
    existingClient.setTelefono(client.getTelefono());

    clientRepository.save(existingClient);
    return userRepository.save(existingUser);
}

    public String patchClient(Long id ) {
        Optional<UserModels> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            UserModels user = optionalUser.get();
            user.setEstadoCuenta(true);
            userRepository.save(user);
            return "Usuario con id " + id + " ha sido eliminado";
        }else{
            return "usuario con id " + id + " no existe";
        }
    }
}
