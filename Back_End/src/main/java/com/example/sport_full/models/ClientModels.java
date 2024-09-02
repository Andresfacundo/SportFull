package com.example.sport_full.models;


import jakarta.persistence.*;
import org.apache.catalina.User;

import java.io.Serializable;

@Entity
@Table(name = "Perfil_cliente")
public class ClientModels implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = true, unique = true)  // Hacer opcionales las columnas
    private String CC;

    @Column(nullable = true, unique = true)  // Hacer opcionales las columnas
    private String telefono;

    @OneToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    private UserModels userModels;

    // Getters y Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
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

    public void setUserModels(UserModels userModels) {
        this.userModels = userModels;
    }
}
