package com.example.sport_full.models;

import jakarta.persistence.*;

@Entity
@Table(name = "MetodoDePago")
public class PaymentMethodModels {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String metodoPago;

    private String total;

    public enum estado {
        PENDIENTE,
        RECHAZADA,
        CONFIRMADA

    }

    @OneToOne(mappedBy = "metododepago", cascade = CascadeType.ALL)
    private ReservationsModels reservationsModels;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public String getTotal() {
        return total;
    }

    public void setTotal(String total) {
        this.total = total;
    }

    public ReservationsModels getReservationsModels() {
        return reservationsModels;
    }

    public void setReservationsModels(ReservationsModels reservationsModels) {
        this.reservationsModels = reservationsModels;
    }
}
