package com.example.sport_full.models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.Arrays;
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
    @JoinColumn(name = "empresa_id", referencedColumnName = "id")
    private AdminModels adminModels;

    @OneToMany(mappedBy = "fieldModels")
    private List<ReservationsModels> reservations;

    @ElementCollection
    @CollectionTable(name = "field_servicios", joinColumns = @JoinColumn(name = "field_id"))
    @Column(name = "servicio")
    private List<String> servicios = new ArrayList<>();

    @Column(nullable = false)
    private String tipoCancha;

    // Constructor por defecto que inicializa los servicios por defecto
    public FieldModels() {
        this.servicios = Arrays.asList(
                "Petos",
                "Guantes",
                "Baños",
                "Duchas",
                "Iluminación",
                "Bebederos",
                "Estacionamiento",
                "Vestidores"
        );
    }

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

    public List<ReservationsModels> getReservations() {
        return reservations;
    }

    public void setReservations(List<ReservationsModels> reservations) {
        this.reservations = reservations;
    }
}
