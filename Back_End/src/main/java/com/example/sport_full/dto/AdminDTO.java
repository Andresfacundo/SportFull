package com.example.sport_full.dto;

import com.example.sport_full.models.FieldModels;

import java.time.LocalTime;
import java.util.List;

public class AdminDTO {
    private Long id;
    private String NIT;

    public List<FieldModels> getFields() {
        return fields;
    }

    public void setFields(List<FieldModels> fields) {
        this.fields = fields;
    }

    private String nombreEmpresa;
    private String telefonoEmpresa;
    private String emailEmpresa;
    private String direccionEmpresa;
    private String CCpropietario;
    private String telefonoPropietario;
    private String facebook;
    private String whatsApp;
    private String instagram;
    private LocalTime horaApertura;
    private List<FieldModels> fields;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<String> getDiasApertura() {
        return diasApertura;
    }

    public void setDiasApertura(List<String> diasApertura) {
        this.diasApertura = diasApertura;
    }

    public List<String> getServiciosGenerales() {
        return serviciosGenerales;
    }

    public void setServiciosGenerales(List<String> serviciosGenerales) {
        this.serviciosGenerales = serviciosGenerales;
    }

    public LocalTime getHoraCierre() {
        return horaCierre;
    }

    public void setHoraCierre(LocalTime horaCierre) {
        this.horaCierre = horaCierre;
    }

    public LocalTime getHoraApertura() {
        return horaApertura;
    }

    public void setHoraApertura(LocalTime horaApertura) {
        this.horaApertura = horaApertura;
    }

    public String getInstagram() {
        return instagram;
    }

    public void setInstagram(String instagram) {
        this.instagram = instagram;
    }

    public String getWhatsApp() {
        return whatsApp;
    }

    public void setWhatsApp(String whatsApp) {
        this.whatsApp = whatsApp;
    }

    public String getFacebook() {
        return facebook;
    }

    public void setFacebook(String facebook) {
        this.facebook = facebook;
    }

    public String getTelefonoPropietario() {
        return telefonoPropietario;
    }

    public void setTelefonoPropietario(String telefonoPropietario) {
        this.telefonoPropietario = telefonoPropietario;
    }

    public String getCCpropietario() {
        return CCpropietario;
    }

    public void setCCpropietario(String CCpropietario) {
        this.CCpropietario = CCpropietario;
    }

    public String getDireccionEmpresa() {
        return direccionEmpresa;
    }

    public void setDireccionEmpresa(String direccionEmpresa) {
        this.direccionEmpresa = direccionEmpresa;
    }

    public String getEmailEmpresa() {
        return emailEmpresa;
    }

    public void setEmailEmpresa(String emailEmpresa) {
        this.emailEmpresa = emailEmpresa;
    }

    public String getTelefonoEmpresa() {
        return telefonoEmpresa;
    }

    public void setTelefonoEmpresa(String telefonoEmpresa) {
        this.telefonoEmpresa = telefonoEmpresa;
    }

    public String getNombreEmpresa() {
        return nombreEmpresa;
    }

    public void setNombreEmpresa(String nombreEmpresa) {
        this.nombreEmpresa = nombreEmpresa;
    }

    public String getNIT() {
        return NIT;
    }

    public void setNIT(String NIT) {
        this.NIT = NIT;
    }

    private LocalTime horaCierre;
    private List<String> serviciosGenerales;
    private List<String> diasApertura;

}
