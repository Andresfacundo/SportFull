package com.example.sport_full.controllers;

import com.example.sport_full.dto.ConfirmacionPagoDTO;
import com.example.sport_full.services.PagoService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    @Autowired
    PagoService pagoService;

//    @PostMapping("/confirmacion")
//    public ResponseEntity<String> recibirConfirmacion(@RequestBody Map<String, Object> datosPago) {
//        System.out.println("Datos recibidos del webhook: " + datosPago);
//        if (datosPago == null || !datosPago.containsKey("x_ref_payco") ||
//                !datosPago.containsKey("x_response") || !datosPago.containsKey("x_extra1")) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Datos incompletos en la notificación.");
//        }
//
//
//        try {
//            String referenciaPago = (String) datosPago.get("x_ref_payco");
//            String estadoPago = (String) datosPago.get("x_response");
//            Long idReserva = Long.valueOf((String) datosPago.get("x_extra1"));
//            Double monto = Double.parseDouble((String) datosPago.get("x_amount"));
//            String moneda = (String) datosPago.get("x_currency_code");
//
//            // Guardar el registro del pago
//            pagoService.guardarPago(referenciaPago, estadoPago, monto, moneda);
//
//            // Actualizar el estado de la reserva si el pago es aceptado
//            if ("Aceptada".equalsIgnoreCase(estadoPago)) {
//                pagoService.actualizarReservaAConfirmada(idReserva);
//            }
//
//            return ResponseEntity.ok("Notificación recibida correctamente");
//        } catch (NumberFormatException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error en el formato de los datos numéricos.");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Error al procesar la notificación: " + e.getMessage());
//        }
//    }
//@PostMapping("/confirmacion")
//public ResponseEntity<?> recibirConfirmacion(@RequestBody ConfirmacionPagoDTO datosPago) {
//    try {
//        // Validar campos obligatorios
//        if (datosPago.getX_ref_payco() == null || datosPago.getX_response() == null || datosPago.getX_extra1() == null) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Datos incompletos en la notificación.");
//        }
//
//        // Convertir y procesar los datos
//        String referenciaPago = datosPago.getX_ref_payco();
//        String estadoPago = datosPago.getX_response();
//        Long idReserva = Long.valueOf(datosPago.getX_extra1());
//        Double monto = Double.parseDouble(datosPago.getX_amount());
//        String moneda = datosPago.getX_currency_code();
//        String metodoPago = datosPago.getX_franchise();
//        String descripcion = datosPago.getX_description();
//        String factura = datosPago.getX_factura();
//        Integer clienteId = 123; // Ajusta según tu lógica
//        String datosAdicionales = "Correo: " + datosPago.getX_customer_email() + ", Aprobación: " + datosPago.getX_approval_code();
//
//        // Guardar el registro del pago
//        pagoService.guardarPago(referenciaPago, estadoPago, monto, moneda, metodoPago, descripcion, factura, clienteId, datosAdicionales);
//
//        // Actualizar el estado de la reserva si el pago es aceptado
//        if ("Aceptada".equalsIgnoreCase(estadoPago)) {
//            pagoService.actualizarReservaAConfirmada(idReserva);
//        }
//
//        return ResponseEntity.ok(referenciaPago);
//    } catch (NumberFormatException e) {
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error en el formato de los datos numéricos.");
//    } catch (Exception e) {
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                .body("Error al procesar la notificación: " + e.getMessage());
//    }
//}
@PostMapping("/confirmacion")
public ResponseEntity<?> recibirConfirmacion(@RequestBody ConfirmacionPagoDTO datosPago) {
    try {
        // Validar campos obligatorios
        if (datosPago.getX_ref_payco() == null || datosPago.getX_response() == null || datosPago.getX_extra1() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Datos incompletos en la notificación.");
        }

        // Convertir y procesar los datos
        String referenciaPago = datosPago.getX_ref_payco();
        String estadoPago = datosPago.getX_response();
        Long idReserva = Long.valueOf(datosPago.getX_extra1());
        Double monto = Double.parseDouble(datosPago.getX_amount());
        String moneda = datosPago.getX_currency_code();
        String metodoPago = datosPago.getX_franchise();
        String descripcion = datosPago.getX_description();
        String factura = datosPago.getX_factura();
        Integer clienteId = 123; // Ajusta según tu lógica
        String datosAdicionales = "Correo: " + datosPago.getX_customer_email() + ", Aprobación: " + datosPago.getX_approval_code();

        // Guardar el registro del pago
        pagoService.guardarPago(referenciaPago, estadoPago, monto, moneda, metodoPago, descripcion, factura, clienteId, datosAdicionales);

        // Actualizar el estado de la reserva si el pago es aceptado
        if ("Aceptada".equalsIgnoreCase(estadoPago)) {
            pagoService.actualizarReservaAConfirmada(idReserva);
        }

        // Construir y devolver el objeto de respuesta con datos procesados
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("referenciaPago", referenciaPago);
        responseData.put("estadoPago", estadoPago);
        responseData.put("idReserva", idReserva);
        responseData.put("monto", monto);
        responseData.put("moneda", moneda);
        responseData.put("metodoPago", metodoPago);
        responseData.put("descripcion", descripcion);
        responseData.put("factura", factura);
        responseData.put("clienteId", clienteId);
        responseData.put("datosAdicionales", datosAdicionales);

        return ResponseEntity.ok(responseData);
    } catch (NumberFormatException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error en el formato de los datos numéricos.");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al procesar la notificación: " + e.getMessage());
    }
}


//    @GetMapping("/respuesta")
//    public ResponseEntity<Void> redirigirDespuesDelPago(HttpServletResponse response) throws IOException {
//        response.sendRedirect("http://localhost:5173");
//        return ResponseEntity.status(HttpStatus.FOUND).build();
//    }

//@GetMapping("/respuesta")
//public ResponseEntity<String> redirigirDespuesDelPago(
//        @RequestParam(name = "ref_payco", required = false) String referenciaPago) {
//    // Mostrar en consola el dato recibido
//    System.out.println("Datos recibidos en la respuesta: ref_payco = " + referenciaPago);
//
//    // Redirigir al frontend
//    return ResponseEntity.status(HttpStatus.FOUND)
//            .header("Location", "http://localhost:5173")
//            .build();
//}

    @GetMapping("/respuesta")
    public ResponseEntity<String> redirigirDespuesDelPago(
            @RequestParam(name = "ref_payco", required = false) String referenciaPago) {
        // Mostrar en consola el dato recibido
        System.out.println("Datos recibidos en la respuesta: ref_payco = " + referenciaPago);

        // Redirigir al frontend
        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", "http://localhost:5173")
                .build();
    }




    @GetMapping("/prueba")
    public ResponseEntity<String> prueba() {
        return ResponseEntity.ok("Endpoint funcionando correctamente");
    }
}
