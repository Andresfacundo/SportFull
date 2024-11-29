package com.example.sport_full.services;


import com.example.sport_full.models.FieldModels;
import com.example.sport_full.repositories.IFieldRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;



@Service
public class FieldServices {
    @Autowired
    private IFieldRepository fieldRepository;

    public List<FieldModels> getAllFields() {
        return (List<FieldModels>) fieldRepository.findAllWithAdmin();
    }
}
