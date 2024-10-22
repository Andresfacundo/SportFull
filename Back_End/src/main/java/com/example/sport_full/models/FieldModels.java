package com.example.sport_full.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "canchas_sinteticas")
public class FieldModels {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private Double precio;

    @Column(nullable = false)
    private String estado;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "empresa_id", referencedColumnName = "id")
    private AdminModels adminModels;

    @ElementCollection
    @CollectionTable(name = "field_servicios", joinColumns = @JoinColumn(name = "field_id"))
    @Column(name = "servicio")
    private List<String> servicios = new ArrayList<>();

    @Column(nullable = false)
    private String tipoCancha;

    // Constructor por defecto
    public FieldModels() {}

    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public AdminModels getAdminModels() {
        return adminModels;
    }

    public void setAdminModels(AdminModels adminModels) {
        this.adminModels = adminModels;
    }

    public List<String> getServicios() {
        return servicios;
    }

    public void setServicios(List<String> servicios) {
        this.servicios = servicios;
    }

    public String getTipoCancha() {
        return tipoCancha;
    }

    public void setTipoCancha(String tipoCancha) {
        this.tipoCancha = tipoCancha;
    }
}
