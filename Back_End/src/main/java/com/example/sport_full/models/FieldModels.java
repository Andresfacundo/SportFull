package com.example.sport_full.models;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "canchas-sinteticas")
public class FieldModels {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private Double precio;

    @Column(nullable = false)
    private String estado;  // Reservada, Disponible, Fuera de servicio

    @ManyToOne
    @JoinColumn(name = "empresa_id", referencedColumnName = "id")
    private AdminModels adminModels;

    @OneToMany(mappedBy = "fieldModels")
    private List<ReservationsModels> reservations;

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
}
