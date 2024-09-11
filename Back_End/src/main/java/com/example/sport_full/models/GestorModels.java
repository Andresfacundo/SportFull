package com.example.sport_full.models;

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

    @Column(nullable = true, unique = true)
    private String nombreCompleto;

    @Column(nullable = true, unique = true)
    private String email;

    @Column(nullable = true)
    private String telefono;

    @OneToOne
    @JoinColumn(name = "empresa_id", referencedColumnName = "id", unique = true)
    private AdminModels adminempresa;

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
}
