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

    @Column(nullable = false, unique = true)
    private LocalDateTime fechaHoraInicio;

    @Column(nullable = false, unique = true)
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

    private Long costoHora;

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

    public Long getCostoHora() {
        return costoHora;
    }

    public void setCostoHora(Long costoHora) {
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
}
