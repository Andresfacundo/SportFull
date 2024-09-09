package com.example.sport_full.models;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.Where;

import java.io.Serializable;

@Entity
@Table(name = "Perfil_empresa")
public class AdminModels implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true, unique = true) // Hacer opcionales los columnas
    private String NIT;

    @Column(nullable = true)  // Hacer opcionales las columnas
    private String nombreEmpresa;

    @Column(nullable = true)
    private String telefonoEmpresa;

    @Column(nullable = true, unique = true)
    private String emailEmpresa;

    @Column(nullable = true)
    private String direccionEmpresa;

    @Column(nullable = true, unique = true)
    private String CCpropietario;

    @Column(nullable = true)
    private String telefonoPropietario;

    @OneToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", unique = true)
    @JsonIgnore
    private UserModels userModels;

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNIT() {
        return NIT;
    }

    public void setNIT(String NIT) {
        this.NIT = NIT;
    }

    public String getNombreEmpresa() {
        return nombreEmpresa;
    }

    public void setNombreEmpresa(String nombreEmpresa) {
        this.nombreEmpresa = nombreEmpresa;
    }

    public String getTelefonoEmpresa() {
        return telefonoEmpresa;
    }

    public void setTelefonoEmpresa(String telefonoEmpresa) {
        this.telefonoEmpresa = telefonoEmpresa;
    }

    public String getEmailEmpresa() {
        return emailEmpresa;
    }

    public void setEmailEmpresa(String emailEmpresa) {
        this.emailEmpresa = emailEmpresa;
    }

    public String getDireccionEmpresa() {
        return direccionEmpresa;
    }

    public void setDireccionEmpresa(String direccionEmpresa) {
        this.direccionEmpresa = direccionEmpresa;
    }

    public String getCCpropietario() {
        return CCpropietario;
    }

    public void setCCpropietario(String CCpropietario) {
        this.CCpropietario = CCpropietario;
    }

    public String getTelefonoPropietario() {
        return telefonoPropietario;
    }

    public void setTelefonoPropietario(String telefonoPropietario) {
        this.telefonoPropietario = telefonoPropietario;
    }

    public UserModels getUserModels() {
        return userModels;
    }

    public void setUserModels(UserModels userModels) {
        this.userModels = userModels;
    }
}
