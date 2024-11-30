package com.example.sport_full.controllers;

import com.example.sport_full.models.Pago;
import com.example.sport_full.models.ReservationsModels;
import com.example.sport_full.repositories.IReservationsRepository;
import com.example.sport_full.repositories.PagoRepository;
import com.example.sport_full.services.PagoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    private final IReservationsRepository reservationsRepository;


    private final PagoRepository pagoRepository;

    // Constructor
    public PagoController(IReservationsRepository reservationsRepository, PagoRepository pagoRepository) {
        this.reservationsRepository = reservationsRepository;
        this.pagoRepository = pagoRepository;
    }

    @GetMapping("/respuesta")
    public ResponseEntity<Void> redirigirDespuesDelPago(
            @RequestParam(name = "ref_payco", required = false) String referenciaPago,
            @RequestParam(name = "reservation_id", required = false) Long reservaId) {

        System.out.println("Datos recibidos en la respuesta: ref_payco = " + referenciaPago + ", reservaId = " + reservaId);

        if (referenciaPago != null && reservaId != null) {
            try {
                // Realizar la solicitud al enlace de validación
                String url = "https://secure.epayco.co/validation/v1/reference/" + referenciaPago;
                RestTemplate restTemplate = new RestTemplate();

                // Obtener el objeto de respuesta desde la API
                ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

                // Filtrar los datos del objeto de respuesta
                Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
                if (data != null) {
                    // Extraer los valores necesarios
                    String estado = data.get("x_transaction_state").toString();
                    Double monto = Double.parseDouble(data.get("x_amount").toString());
                    String factura = data.get("x_id_factura").toString();
                    String metodoPago = data.get("x_franchise").toString();
                    String moneda = data.get("x_currency_code").toString();
                    String descripcion = data.get("x_description").toString();

                    // Crear un nuevo objeto Pago y guardar en la base de datos
                    Pago pago = new Pago();
                    pago.setReferenciaPago(referenciaPago);
                    pago.setMonto(monto);
                    pago.setEstado(estado);
                    pago.setFactura(factura);
                    pago.setMetodoPago(metodoPago);
                    pago.setMoneda(moneda);
                    pago.setDescripcion(descripcion);
                    pago.setFechaCreacion(LocalDateTime.now());

                    // Asociar el pago con la reserva
                    ReservationsModels reserva = reservationsRepository.findById(reservaId).orElseThrow(() ->
                            new RuntimeException("Reserva no encontrada con ID: " + reservaId));
                    pago.setReservation(reserva);
                    pagoRepository.save(pago);

                    System.out.println("Pago almacenado: referencia = " + referenciaPago + ", monto = " + monto +
                            ", estado = " + estado + ", factura = " + factura + ", metodoPago = " + metodoPago +
                            ", moneda = " + moneda);

                    // Si el pago es aceptado, actualizar el estado de la reserva
                    if ("Aceptada".equalsIgnoreCase(estado)) {
                        reserva.setEstadoReserva(ReservationsModels.estadoReserva.CONFIRMADA);
                        reservationsRepository.save(reserva); // Guardar los cambios en la base de datos
                        System.out.println("Reserva confirmada con ID: " + reservaId);
                    }
                } else {
                    System.err.println("No se encontró información en la respuesta de la API de Epayco.");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
                }
            } catch (Exception e) {
                System.err.println("Error al procesar el pago: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } else {
            System.err.println("No se recibió el parámetro ref_payco o reservation_id.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        // Redirigir al frontend
        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", "http://localhost:5173/HistorialCliente")
                .build();
    }

}
