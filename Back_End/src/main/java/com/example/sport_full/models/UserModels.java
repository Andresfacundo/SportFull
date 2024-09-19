package com.example.sport_full.models;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.Where;

import java.io.Serializable;

@Entity
@Table(name = "usuarios")
@Where(clause = "estado_cuenta = false")
public class UserModels implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String nombreCompleto;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String contraseña;

    @Column(nullable = false)
    private String tipoUsuario;

    // Relación opcional con ClientModels
    @OneToOne(mappedBy = "userModels", cascade = CascadeType.ALL, optional = true)
    private ClientModels clientModels;

    // Relación opcional con AdminModels
    @OneToOne(mappedBy = "userModels", cascade = CascadeType.ALL, optional = true)
    private AdminModels adminModels;

    private boolean estadoCuenta;

    // Getters y Setters

    public long getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public String getTipoUsuario() {
        return tipoUsuario;
    }

    public void setTipoUsuario(String tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }

    public ClientModels getClientModels() {
        return clientModels;
    }

    public void setClientModels(ClientModels clientModels) {
        this.clientModels = clientModels;
    }

    public AdminModels getAdminModels() {
        return adminModels;
    }

    public void setAdminModels(AdminModels adminModels) {
        this.adminModels = adminModels;
    }

    public boolean isEstadoCuenta() {
        return estadoCuenta;
    }

    public void setEstadoCuenta(boolean estadoCuenta) {
        this.estadoCuenta = estadoCuenta;
    }
}
