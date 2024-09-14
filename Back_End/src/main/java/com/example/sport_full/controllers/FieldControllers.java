package com.example.sport_full.controllers;

import com.example.sport_full.models.AdminModels;
import com.example.sport_full.models.FieldModels;
import com.example.sport_full.models.UserModels;
import com.example.sport_full.repositories.IFieldRepository;
import com.example.sport_full.repositories.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/fields")
public class FieldControllers {

    private final IFieldRepository fieldRepository;
    private final IUserRepository userRepository;

    @Autowired
    public FieldControllers(IFieldRepository fieldRepository, IUserRepository userRepository) {
        this.fieldRepository = fieldRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/create/{empresaId}")
    public ResponseEntity<?> createField(@RequestBody FieldModels fieldModels, @PathVariable Long empresaId) {
        Optional<UserModels> userOptional = userRepository.findById(empresaId);

        if (userOptional.isPresent()) {
            UserModels user = userOptional.get();

            if (!"EMPRESA".equalsIgnoreCase(user.getTipoUsuario())) {
                return new ResponseEntity<>("El usuario no es de tipo EMPRESA", HttpStatus.UNAUTHORIZED);
            }

            AdminModels admin = user.getAdminModels();
            fieldModels.setAdminModels(admin);
            FieldModels savedField = fieldRepository.save(fieldModels);

            return new ResponseEntity<>(savedField, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Empresa no encontrada", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/list/{empresaId}")
    public ResponseEntity<?> listFields(@PathVariable Long empresaId) {
        Optional<UserModels> userOptional = userRepository.findById(empresaId);

        if (userOptional.isPresent()) {
            UserModels user = userOptional.get();

            if (!"EMPRESA".equalsIgnoreCase(user.getTipoUsuario())) {
                return new ResponseEntity<>("El usuario no es de tipo EMPRESA", HttpStatus.UNAUTHORIZED);
            }

            List<FieldModels> fields = fieldRepository.findByAdminModels_Id(empresaId);
            return new ResponseEntity<>(fields, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Empresa no encontrada", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update/{fieldId}/{empresaId}")
    public ResponseEntity<?> updateField(@PathVariable Long fieldId, @RequestBody FieldModels fieldDetails, @PathVariable Long empresaId) {
        Optional<FieldModels> fieldOptional = fieldRepository.findById(fieldId);
        Optional<UserModels> userOptional = userRepository.findById(empresaId);

        if (fieldOptional.isPresent() && userOptional.isPresent()) {
            UserModels user = userOptional.get();

            if (!"EMPRESA".equalsIgnoreCase(user.getTipoUsuario())) {
                return new ResponseEntity<>("El usuario no es de tipo EMPRESA", HttpStatus.UNAUTHORIZED);
            }

            FieldModels field = fieldOptional.get();
            field.setNombre(fieldDetails.getNombre());
            field.setPrecio(fieldDetails.getPrecio());
            field.setEstado(fieldDetails.getEstado());

            fieldRepository.save(field);
            return new ResponseEntity<>(field, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Campo o empresa no encontrados", HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete/{fieldId}/{empresaId}")
    public ResponseEntity<?> deleteField(@PathVariable Long fieldId, @PathVariable Long empresaId) {
        Optional<FieldModels> fieldOptional = fieldRepository.findById(fieldId);
        Optional<UserModels> userOptional = userRepository.findById(empresaId);

        if (fieldOptional.isPresent() && userOptional.isPresent()) {
            UserModels user = userOptional.get();

            if (!"EMPRESA".equalsIgnoreCase(user.getTipoUsuario())) {
                return new ResponseEntity<>("El usuario no es de tipo EMPRESA", HttpStatus.UNAUTHORIZED);
            }

            fieldRepository.deleteById(fieldId);
            return new ResponseEntity<>("Campo eliminado correctamente", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Campo o empresa no encontrados", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/find-all")
    public ResponseEntity<List<FieldModels>> findAllFields() {
        List<FieldModels> fields = fieldRepository.findAll();
        return new ResponseEntity<>(fields, HttpStatus.OK);
    }
}
