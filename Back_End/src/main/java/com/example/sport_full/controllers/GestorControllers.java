package com.example.sport_full.controllers;

import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.GestorModels;
import com.example.sport_full.repositories.ICompanyRepository;
import com.example.sport_full.repositories.IGestorRepository;
import com.example.sport_full.services.GestorServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/admin/gestor")
public class GestorControllers {

    @Autowired
    GestorServices gestorServices;

    @Autowired
    IGestorRepository igestorRepository;

    @Autowired
    ICompanyRepository icompanyRepository;

    @PostMapping
    public GestorModels createGestor(
            @RequestParam String ccgestor,
            @RequestParam String nombreCompleto,
            @RequestParam String email,
            @RequestParam String telefono,
            @RequestParam Long adminEmpresa_id) {
        AdminModels admin = icompanyRepository.findById(adminEmpresa_id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con adminEmpresa_id " + adminEmpresa_id));
        GestorModels gestor = new GestorModels();
        gestor.setCCgestor(ccgestor);
        gestor.setNombreCompleto(nombreCompleto);
        gestor.setEmail(email);
        gestor.setTelefono(telefono);
        gestor.setAdminempresa(admin);
        return gestorServices.saveGestor(gestor);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<GestorModels> findById(@PathVariable Long id) {
        Optional<GestorModels> gestor = this.igestorRepository.findById(id);
        if (gestor.isPresent()) {
            return ResponseEntity.ok(gestor.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<GestorModels> updateGestor(@PathVariable("id") Long id, @RequestBody GestorModels gestorModels) {
        Optional<GestorModels> existingGestor = this.igestorRepository.findById(id);
        if (existingGestor.isPresent()) {
            Optional<AdminModels> adminEmpresa = icompanyRepository.findById(gestorModels.getAdminempresa().getId());
            if (adminEmpresa.isPresent()) {
                gestorModels.setAdminempresa(adminEmpresa.get());
                GestorModels updatedGestor = this.gestorServices.updateGestor(gestorModels, id);
                return ResponseEntity.ok(updatedGestor);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGestor(@PathVariable("id") Long id) {
        if (this.igestorRepository.existsById(id)) {
            this.igestorRepository.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}