package com.example.sport_full.models;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.Where;

import java.io.Serializable;

@Entity
@Table(name = "Perfil_cliente")
@Where(clause = "estado_cuenta = false")
public class ClientModels implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true, unique = true)  // Hacer opcionales las columnas
    private String CC;

    @Column(nullable = true)  // Hacer opcionales las columnas
    private String telefono;

    @OneToOne
    @JsonIgnore
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    private UserModels userModels;

    private boolean estadoCuenta;

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

    public void setUserModels(UserModels userModels) {
        this.userModels = userModels;
    }

    public boolean isEstadoCuenta() {
        return estadoCuenta;
    }

    public void setEstadoCuenta(boolean estadoCuenta) {
        this.estadoCuenta = estadoCuenta;
    }
}
