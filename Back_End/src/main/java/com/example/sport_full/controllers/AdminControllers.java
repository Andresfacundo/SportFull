package com.example.sport_full.controllers;


import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.ClientModels;
import com.example.sport_full.repositories.ICompanyRepository;
import com.example.sport_full.repositories.IUserRepository;
import com.example.sport_full.services.AdminServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/admin")
public class AdminControllers {

    @Autowired
    ICompanyRepository companyRepository;

    @Autowired
    AdminServices adminServices;

    @PutMapping("/{id}")
    public ResponseEntity<AdminModels> updateClient(@PathVariable("id") Long id, @RequestBody AdminModels request) {
        Optional<AdminModels> existingAdmin = this.adminServices.getAdmin(id);
        if (existingAdmin.isPresent()) {
            AdminModels updatedAdminModels = this.adminServices.updateAdmin(request, id);
            return ResponseEntity.ok(updatedAdminModels);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminModels> getAdminById(@PathVariable("id") Long id) {
        Optional<AdminModels> admin = this.adminServices.getAdmin(id);
        if (admin.isPresent()) {
            return ResponseEntity.ok(admin.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdminById(@PathVariable("id") Long id) {
        Optional<AdminModels> admin = this.adminServices.getAdmin(id);
        if (admin.isPresent()) {
            this.adminServices.deleteAdmin(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
