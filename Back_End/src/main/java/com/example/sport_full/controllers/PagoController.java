package com.example.sport_full.controllers;

import com.example.sport_full.models.Pago;
import com.example.sport_full.models.ReservationsModels;
import com.example.sport_full.repositories.PagoRepository;
import com.example.sport_full.repositories.IReservationsRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    private final PagoRepository pagoRepository;
    private final IReservationsRepository reservaRepository;

    // Constructor con inyección de dependencias
    public PagoController(PagoRepository pagoRepository, IReservationsRepository reservaRepository) {
        this.pagoRepository = pagoRepository;
        this.reservaRepository = reservaRepository;
    }

    /**
     * Endpoint para recibir la confirmación de pago desde ePayco
     */
    @PostMapping("/confirmacion")
    public ResponseEntity<String> recibirConfirmacion(@RequestBody Map<String, Object> datosPago) {
        System.out.println("Datos recibidos del webhook: " + datosPago);

        try {
            // Extraer datos relevantes del webhook
            String referenciaPago = (String) datosPago.get("x_ref_payco");
            String estadoPago = (String) datosPago.get("x_response");
            String idReserva = (String) datosPago.get("x_extra1"); // ID de la reserva enviado como parámetro extra
            Double monto = Double.parseDouble((String) datosPago.get("x_amount"));
            String moneda = (String) datosPago.get("x_currency_code");

            // Guardar el registro del pago
            Pago pago = new Pago();
            pago.setReferenciaPago(referenciaPago);
            pago.setEstado(estadoPago);
            pago.setMonto(monto);
            pago.setMoneda(moneda);
            pago.setFechaCreacion(LocalDateTime.now());
            pagoRepository.save(pago);

            // Actualizar el estado de la reserva si el pago es aceptado
            if ("Aceptada".equalsIgnoreCase(estadoPago)) {
                ReservationsModels reserva = reservaRepository.findById(Long.valueOf(idReserva)).orElse(null);
                if (reserva == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("Reserva no encontrada para el ID: " + idReserva);
                }
                reserva.setEstadoReserva(ReservationsModels.estadoReserva.valueOf("confirmado")); // Cambiar el estado a "confirmado"
                reservaRepository.save(reserva);
                System.out.println("Reserva actualizada a estado confirmado: " + idReserva);
            }

            // Responder a ePayco que el webhook fue procesado correctamente
            return ResponseEntity.ok("Notificación recibida correctamente");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar la notificación: " + e.getMessage());
        }
    }
}
