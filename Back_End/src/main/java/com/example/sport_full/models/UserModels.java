package com.example.sport_full.models;


import jakarta.persistence.*;
import org.hibernate.annotations.Where;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Where(clause = "estado_cuenta = false")
public class UserModels implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String nombres;

    @Column(nullable = false)
    private String apellidos;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String contraseña;

    @Column(nullable = false)
    private String tipoUsuario;

    @Column(name = "fecha_inhabilitacion")
    private LocalDateTime fechaInhabilitacion;

    @Column(name = "tiempo_limite_reactivacion")
    private long tiempoLimiteReactivacion = 30;

    // Relación opcional con ClientModels
    @OneToOne(mappedBy = "userModels", cascade = CascadeType.ALL, optional = true)
    private ClientModels clientModels;

    // Relación opcional con AdminModels
    @OneToOne(mappedBy = "userModels", cascade = CascadeType.ALL, optional = true)
    private AdminModels adminModels;

    // Relación opcional con AdminModels
    @OneToOne(mappedBy = "userModels", cascade = CascadeType.ALL, optional = true)
    private GestorModels gestorModels;

    private boolean estadoCuenta;

    private boolean emailVerified = false;

    private String verificationToken;  // Campo para el token de verificación


    // Getters y Setters
    public LocalDateTime getFechaInhabilitacion() {
        return fechaInhabilitacion;
    }

    public void setFechaInhabilitacion(LocalDateTime fechaInhabilitacion) {
        this.fechaInhabilitacion = fechaInhabilitacion;
    }

    public long getTiempoLimiteReactivacion() {
        return tiempoLimiteReactivacion;
    }

    public void setTiempoLimiteReactivacion(long tiempoLimiteReactivacion) {
        this.tiempoLimiteReactivacion = tiempoLimiteReactivacion;
    }

    public long getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombreCompleto) {
        this.nombres = nombreCompleto;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
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


    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public String getVerificationToken() {
        return verificationToken;
    }

    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }

    public GestorModels getGestorModels() {
        return gestorModels;
    }

    public void setGestorModels(GestorModels gestorModels) {
        this.gestorModels = gestorModels;
    }
}
