package com.example.sport_full.models;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservas")
public class ReservationsModels {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "idCancha", referencedColumnName = "id")
    private FieldModels fieldModels;

    @ManyToOne
    @JoinColumn(name = "empresa_id", referencedColumnName = "id")
    private AdminModels adminModels;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserModels userModels; // Nueva relación para soporte de reservas por usuarios

    @Column(nullable = false)
    private LocalDateTime fechaHoraInicio;

    @Column(nullable = false)
    private LocalDateTime fechaHoraFin;

    @Column(nullable = false)
    private LocalDate fechaPago;


    @Enumerated(EnumType.STRING)
    private estadoReserva estadoReserva;

    public enum estadoReserva {
        PENDIENTE,
        CONFIRMADA,
        CANCELADA
    }

    private Double costoHora;

    private Long costoTotal;


    public long getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public FieldModels getFieldModels() {
        return fieldModels;
    }

    public void setFieldModels(FieldModels fieldModels) {
        this.fieldModels = fieldModels;
    }

    public AdminModels getAdminModels() {
        return adminModels;
    }

    public void setAdminModels(AdminModels adminModels) {
        this.adminModels = adminModels;
    }

    public LocalDateTime getFechaHoraInicio() {
        return fechaHoraInicio;
    }

    public void setFechaHoraInicio(LocalDateTime fechaHoraInicio) {
        this.fechaHoraInicio = fechaHoraInicio;
    }

    public LocalDateTime getFechaHoraFin() {
        return fechaHoraFin;
    }

    public void setFechaHoraFin(LocalDateTime fechaHoraFin) {
        this.fechaHoraFin = fechaHoraFin;
    }

    public LocalDate getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDate fechaPago) {
        this.fechaPago = fechaPago;
    }

    public Double getCostoHora() {
        return costoHora;
    }

    public void setCostoHora(Double costoHora) {
        this.costoHora = costoHora;
    }

    public Long getCostoTotal() {
        return costoTotal;
    }

    public void setCostoTotal(Long costoTotal) {
        this.costoTotal = costoTotal;
    }

    public ReservationsModels.estadoReserva getEstadoReserva() {
        return estadoReserva;
    }

    public void setEstadoReserva(ReservationsModels.estadoReserva estadoReserva) {
        this.estadoReserva = estadoReserva;
    }

    public UserModels getUserModels() {
        return userModels;
    }

    public void setUserModels(UserModels userModels) {
        this.userModels = userModels;
    }
}
