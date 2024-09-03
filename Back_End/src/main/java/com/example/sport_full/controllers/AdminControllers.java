package com.example.sport_full.controllers;


import com.example.sport_full.models.AdminModels;
import com.example.sport_full.repositories.ICompanyRepository;
import com.example.sport_full.services.AdminServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
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

    @PatchMapping("/{id}")
    public ResponseEntity<AdminModels> patchAdmin(@PathVariable("id") Long id, @RequestBody Map<String, Object> updates) {
        try {
            AdminModels updatedAdmin = adminServices.patchAdmin(id, updates);
            return ResponseEntity.ok(updatedAdmin);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
