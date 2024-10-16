package com.example.sport_full.validations;

import com.example.sport_full.models.AdminModels;
import com.example.sport_full.repositories.ICompanyRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Component
public class AdminValidations {

    private final ICompanyRepository companyRepository;

    public AdminValidations(ICompanyRepository companyRepository) {

        this.companyRepository = companyRepository;
    }


    public void validate(AdminModels adminModels) {
        // Validación de email existente
        Optional<AdminModels> existingAdmin = companyRepository.findById(adminModels.getId());
        if (existingAdmin.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya existe");
        }
    }
}