package com.example.sport_full.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "Perfil_Gestor")
public class GestorModels implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true, unique = true)
    private String CCgestor;

    @Column(nullable = true)
    private String telefono;

    @ManyToOne
    @JoinColumn(name = "empresa_id", nullable = false)
    @JsonIgnore
    private AdminModels adminempresa;

    @OneToOne
    @JsonIgnore
    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true)
    private UserModels userModels;  // Relación con UserModels

    // Getters y setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCCgestor() {
        return CCgestor;
    }

    public void setCCgestor(String CCgestor) {
        this.CCgestor = CCgestor;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public AdminModels getAdminempresa() {
        return adminempresa;
    }

    public void setAdminempresa(AdminModels adminempresa) {
        this.adminempresa = adminempresa;
    }

    public UserModels getUserModels() {
        return userModels;
    }

    public void setUserModels(UserModels userModels) {
        this.userModels = userModels;
    }
}
