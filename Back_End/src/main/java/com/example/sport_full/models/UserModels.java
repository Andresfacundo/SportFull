package com.example.sport_full.models;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "usuarios")
public class UserModels implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Cambiado de static int a Long

    @Column(nullable = false)
    private String nombreCompleto;

    @Column(unique = true, nullable = false)
    private String email; // Cambiado de static String a String

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

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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
}

