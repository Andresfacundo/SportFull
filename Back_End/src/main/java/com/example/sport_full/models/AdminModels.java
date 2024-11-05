package com.example.sport_full.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.Where;

import java.io.Serializable;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Perfil_empresa")
public class AdminModels implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true, unique = true)
    private String NIT;

    @Column(nullable = true, unique = true)
    private String nombreEmpresa;

    @Column(nullable = true, unique = true)
    private String telefonoEmpresa;

    @Column(nullable = true, unique = true)
    private String emailEmpresa;

    @Column(nullable = true, unique = true)
    private String direccionEmpresa;

    @Column(nullable = true, unique = true)
    private String CCpropietario;

    @Column(nullable = true, unique = true)
    private String telefonoPropietario;

    @Column(nullable = true, unique = true)
    private String facebook;

    @Column(nullable = true, unique = true)
    private String whatsApp;

    @Column(nullable = true, unique = true)
    private String instagram;

    // Horarios de atención
    @Column(nullable = true)
    private LocalTime horaApertura;

    @Column(nullable = true)
    private LocalTime horaCierre;

    // Nueva colección para los servicios generales
    @ElementCollection
    @CollectionTable(name = "servicios_generales", joinColumns = @JoinColumn(name = "empresa_id"))
    @Column(name = "servicio")
    private List<String> serviciosGenerales;

    @OneToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", unique = true)
    @JsonIgnore
    private UserModels userModels;



    @OneToMany(mappedBy = "adminModels")
    private List<ReservationsModels> reservations;


    @OneToMany(mappedBy = "adminempresa", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<GestorModels> gestores = new ArrayList<>();

    @OneToMany(mappedBy = "adminModels")
    private List<FieldModels> fields;


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

    public String getFacebook() {
        return facebook;
    }

    public void setFacebook(String facebook) {
        this.facebook = facebook;
    }

    public String getWhatsApp() {
        return whatsApp;
    }

    public void setWhatsApp(String whatsApp) {
        this.whatsApp = whatsApp;
    }

    public String getInstagram() {
        return instagram;
    }

    public void setInstagram(String instagram) {
        this.instagram = instagram;
    }

    public List<String> getServiciosGenerales() {
        return serviciosGenerales;
    }

    public void setServiciosGenerales(List<String> serviciosGenerales) {
        this.serviciosGenerales = serviciosGenerales;
    }

    public UserModels getUserModels() {
        return userModels;
    }

    public void setUserModels(UserModels userModels) {
        this.userModels = userModels;
    }


    public List<GestorModels> getGestores() {
        return gestores;
    }

    public void setGestores(List<GestorModels> gestores) {
        this.gestores = gestores;
    }


    public List<ReservationsModels> getReservations() {
        return reservations;
    }

    public void setReservations(List<ReservationsModels> reservations) {
        this.reservations = reservations;
    }

    public List<FieldModels> getFields() {
        return fields;
    }

    public void setFields(List<FieldModels> fields) {
        this.fields = fields;
    }

    public LocalTime getHoraApertura() {
        return horaApertura;
    }

    public void setHoraApertura(LocalTime horaApertura) {
        this.horaApertura = horaApertura;
    }

    public LocalTime getHoraCierre() {
        return horaCierre;
    }

    public void setHoraCierre(LocalTime horaCierre) {
        this.horaCierre = horaCierre;
    }
}


