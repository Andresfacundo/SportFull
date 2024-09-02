package com.example.sport_full.services;

import com.example.sport_full.models.AdminModels;
import com.example.sport_full.repositories.ICompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;


@Service
public class AdminServices {

  @Autowired
  ICompanyRepository companyRepository;


    public Optional<AdminModels> getAdmin( Long id) {
        return companyRepository.findById(id);
    }

    public AdminModels updateAdmin(AdminModels adminModels,Long id){
        AdminModels admin = companyRepository.findById(id).get();

        admin.setNombreEmpresa(adminModels.getNombreEmpresa());
        admin.setCedulaPropietario(adminModels.getCedulaPropietario());
        admin.setEmailEmpresa(adminModels.getEmailEmpresa());
        admin.setTelefono(adminModels.getTelefono());
        return companyRepository.save(admin);
    }



}
