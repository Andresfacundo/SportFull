package com.example.sport_full.models;


import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "Perfil_cliente")
public class ClientModels implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Cambiado de int a Long

    @Column(nullable = true, unique = true)
    private String CC;

    @Column(nullable = true, unique = true)
    private String telefono;

    @OneToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    private UserModels userModels;

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCC() {
        return CC;
    }

    public void setCC(String CC) {
        this.CC = CC;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public UserModels getUserModels() {
        return userModels;
    }

    public void setUserModels(UserModels userModels) {  // Método que faltaba
        this.userModels = userModels;
    }
}

