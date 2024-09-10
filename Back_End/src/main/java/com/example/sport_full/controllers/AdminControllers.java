package com.example.sport_full.controllers;


import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.ICompanyRepository;
import com.example.sport_full.repositories.IUserRepository;
import com.example.sport_full.services.AdminServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
public class AdminControllers {

    @Autowired
    ICompanyRepository companyRepository;

    @Autowired
    IUserRepository userRepository;

    @Autowired
    AdminServices adminServices;

    @PutMapping("/{id}")
    public ResponseEntity<UserModels> updateAdmin(@PathVariable("id") Long id, @RequestBody UserModels userModels) {
        Optional<UserModels> existingAdmin = this.userRepository.findById(id);
        if (existingAdmin.isPresent()) {
            AdminModels adminModels = userModels.getAdminModels();
            UserModels updatedUser = this.adminServices.updateAdminAndUser(adminModels, userModels, id);
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/find-all")
    public List<AdminModels> findAll() {
        return companyRepository.findAll();
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<UserModels> findById(@PathVariable("id") Long id) {
        Optional<UserModels> existingUser = this.adminServices.getUser(id);
        if (existingUser.isPresent()) {
            return ResponseEntity.ok(existingUser.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<String> patchAdmin(@PathVariable("id") Long id) {
        if (this.userRepository.existsById(id)) {
            this.adminServices.patchAdmin(id);
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable("id") Long id) {
        if (this.userRepository.existsById(id)) {
            this.userRepository.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }
}