package com.example.sport_full.controllers;

import com.example.sport_full.services.PagoService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    @Autowired
    PagoService pagoService;

    @PostMapping("/confirmacion")
    public ResponseEntity<String> recibirConfirmacion(@RequestBody Map<String, Object> datosPago) {
        System.out.println("Datos recibidos del webhook: " + datosPago);
        if (datosPago == null || !datosPago.containsKey("x_ref_payco") ||
                !datosPago.containsKey("x_response") || !datosPago.containsKey("x_extra1")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Datos incompletos en la notificación.");
        }


        try {
            String referenciaPago = (String) datosPago.get("x_ref_payco");
            String estadoPago = (String) datosPago.get("x_response");
            Long idReserva = Long.valueOf((String) datosPago.get("x_extra1"));
            Double monto = Double.parseDouble((String) datosPago.get("x_amount"));
            String moneda = (String) datosPago.get("x_currency_code");

            // Guardar el registro del pago
            pagoService.guardarPago(referenciaPago, estadoPago, monto, moneda);

            // Actualizar el estado de la reserva si el pago es aceptado
            if ("Aceptada".equalsIgnoreCase(estadoPago)) {
                pagoService.actualizarReservaAConfirmada(idReserva);
            }

            return ResponseEntity.ok("Notificación recibida correctamente");
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error en el formato de los datos numéricos.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar la notificación: " + e.getMessage());
        }
    }

    @GetMapping("/respuesta")
    public ResponseEntity<Void> redirigirDespuesDelPago(HttpServletResponse response) throws IOException {
        response.sendRedirect("http://localhost:5173");
        return ResponseEntity.status(HttpStatus.FOUND).build();
    }
    @GetMapping("/prueba")
    public ResponseEntity<String> prueba() {
        return ResponseEntity.ok("Endpoint funcionando correctamente");
    }
}
