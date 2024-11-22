package com.example.sport_full.services;

import com.example.sport_full.models.Pago;
import com.example.sport_full.repositories.PagoRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PagoService {
    private final PagoRepository pagoRepository;

    public PagoService(PagoRepository pagoRepository) {
        this.pagoRepository = pagoRepository;
    }

    public void guardarPago(Map<String, Object> datosPago) {
        Pago pago = new Pago();
        pago.setReferenciaPago((String) datosPago.get("x_ref_payco"));
        pago.setEstado((String) datosPago.get("x_transaction_state"));
        pago.setMonto(Double.valueOf(datosPago.get("x_amount").toString()));
        pago.setMoneda((String) datosPago.get("x_currency_code"));
        pago.setMetodoPago((String) datosPago.get("x_franchise"));
        pago.setDescripcion((String) datosPago.get("x_description"));
        pago.setFactura((String) datosPago.get("x_id_factura"));
        pago.setClienteId(Integer.valueOf(datosPago.get("x_customer_id").toString()));
        pago.setDatosAdicionales(datosPago.toString());

        pagoRepository.save(pago);
    }
}

