package com.example.sport_full.controllers;

import com.example.sport_full.models.Pago;
import com.example.sport_full.repositories.PagoRepository;
import com.example.sport_full.services.PagoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    private final PagoRepository pagoRepository;

    // Constructor
    public PagoController(PagoRepository pagoRepository) {
        this.pagoRepository = pagoRepository;
    }

    @PostMapping("/confirmacion")
    public ResponseEntity<String> recibirConfirmacion(@RequestBody Map<String, Object> datosPago) {
        System.out.println("Datos recibidos del webhook: " + datosPago);

        try {
            Pago pago = new Pago();

            // Mapear los datos enviados por EpayCo al objeto Pago
            pago.setReferenciaPago((String) datosPago.get("x_ref_payco"));
            pago.setEstado((String) datosPago.get("x_response")); // Estado del pago
            pago.setMonto(Double.parseDouble((String) datosPago.get("x_amount")));
            pago.setMoneda((String) datosPago.get("x_currency_code"));
            pago.setFechaCreacion(LocalDateTime.now());

            // Guardar en la base de datos
            pagoRepository.save(pago);

            // Responder a EpayCo que la notificación fue recibida correctamente
            return ResponseEntity.ok("Notificación recibida correctamente");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar la notificación");
        }
    }
}
