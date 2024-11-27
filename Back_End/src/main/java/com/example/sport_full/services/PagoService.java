package com.example.sport_full.services;

import com.example.sport_full.models.Pago;
import com.example.sport_full.models.ReservationsModels;
import com.example.sport_full.repositories.IReservationsRepository;
import com.example.sport_full.repositories.PagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
public class PagoService {
    private final PagoRepository pagoRepository;

     @Autowired
    IReservationsRepository reservationsRepository;

    public PagoService(PagoRepository pagoRepository) {
        this.pagoRepository = pagoRepository;
    }
//    public void guardarPago(String referenciaPago, String estadoPago, Double monto, String moneda) {
//        Pago pago = new Pago();
//        pago.setReferenciaPago(referenciaPago);
//        pago.setEstado(estadoPago);
//        pago.setMonto(monto);
//        pago.setMoneda(moneda);
//        pago.setFechaCreacion(LocalDateTime.now());
//        pagoRepository.save(pago);
//    }
public Pago guardarPago(String referenciaPago, String estado, Double monto, String moneda,
                        String metodoPago, String descripcion, String factura, Integer clienteId,
                        String datosAdicionales) {
    Pago pago = new Pago();
    pago.setReferenciaPago(referenciaPago);
    pago.setEstado(estado);
    pago.setMonto(monto);
    pago.setMoneda(moneda);
    pago.setMetodoPago(metodoPago);
    pago.setDescripcion(descripcion);
    pago.setFactura(factura);
    pago.setClienteId(clienteId);
    pago.setDatosAdicionales(datosAdicionales);
    return pagoRepository.save(pago);
}

    public void actualizarReservaAConfirmada(Long idReserva) {
        Optional<ReservationsModels> reservaOpt = reservationsRepository.findById(idReserva);

        if (reservaOpt.isEmpty()) {
            throw new IllegalArgumentException("Reserva no encontrada para el ID: " + idReserva);
        }

        ReservationsModels reserva = reservaOpt.get();
        reserva.setEstadoReserva(ReservationsModels.estadoReserva.CONFIRMADA);
        reservationsRepository.save(reserva);
    }
}

