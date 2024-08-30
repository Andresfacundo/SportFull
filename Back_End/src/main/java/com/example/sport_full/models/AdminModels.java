package com.example.sport_full.models;


import jakarta.persistence.*;

@Entity
@Table(name = "Perfil_empresa")
public class AdminModels {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = true, unique = true)  // Hacer opcionales las columnas
    private String nombreEmpresa;

    @Column(nullable = true, unique = true)  // Hacer opcionales las columnas
    private String cedulaPropietario;

    @Column(nullable = true, unique = true)  // Hacer opcionales las columnas
    private String telefono;

    @Column(nullable = true, unique = true)  // Hacer opcionales las columnas
    private String EmailEmpresa;

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

    public String getNombreEmpresa() {
        return nombreEmpresa;
    }

    public void setNombreEmpresa(String nombreEmpresa) {
        this.nombreEmpresa = nombreEmpresa;
    }

    public String getCedulaPropietario() {
        return cedulaPropietario;
    }

    public void setCedulaPropietario(String cedulaPropietario) {
        this.cedulaPropietario = cedulaPropietario;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEmailEmpresa() {
        return EmailEmpresa;
    }

    public void setEmailEmpresa(String emailEmpresa) {
        EmailEmpresa = emailEmpresa;
    }

    public UserModels getUserModels() {
        return userModels;
    }

    public void setUserModels(UserModels userModels) {
        this.userModels = userModels;
    }
}
