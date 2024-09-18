package com.example.sport_full.controllers;

import com.example.sport_full.dto.ChangePasswordDTO;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.IUserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.Optional;

@RestController
@RequestMapping("/security")
public class ChangePasswordControllers {

    @Autowired
    IUserRepository userRepository;



    @PostMapping
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO dto, @RequestParam Long idUser) {
        Optional<UserModels> user = userRepository.findById(idUser);
        if (user.isPresent()) {
            UserModels userModel = user.get();

            if(BCrypt.checkpw(dto.getContraseña(), userModel.getContraseña())){
            userRepository.save(userModel);
            return ResponseEntity.ok().body("Contraseña válida");

            }else{
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
