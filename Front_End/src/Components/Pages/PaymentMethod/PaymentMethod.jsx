import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./PaymentMethod.css";

const PaymentMethod = ({ empresaId, estado, canchaId, fechaHoraInicio, fechaHoraFin }) => {
  const [totalValue, setTotalValue] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener el valor total desde el backend
  const fetchTotalValue = async () => {
    try {
      const params = new URLSearchParams({
        empresaId,
        ...(estado && { estado }), // Agrega el estado solo si existe
        ...(canchaId && { canchaId }),
        ...(fechaHoraInicio && { fechaHoraInicio }),
        ...(fechaHoraFin && { fechaHoraFin }),
      });

      const response = await fetch(`http://localhost:8080/reservas/valorTotal?empresaId=1`);
      console.log(response)
      if (!response.ok) throw new Error("Error al obtener el valor total");

      const data = await response.json();
      setTotalValue(data.totalValue || data); // Maneja ambos formatos de respuesta
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener el valor total:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalValue();
  }, [empresaId, estado, canchaId, fechaHoraInicio, fechaHoraFin]);

  const generateInvoiceNumber = () => {
    return `INV-${uuidv4()}`;
  };

  const configureEpayco = () => {
    if (window.ePayco) {
      return window.ePayco.checkout.configure({
        key: "3449fce5fd499376a733bb03535d4c0b",
        test: true,
      });
    } else {
      console.error("ePayco no está disponible");
      return null;
    }
  };

  const handleFullScreenPayment = () => {
    const ePayco = configureEpayco();
    if (!ePayco || !totalValue) return;

    const paymentData = {
      name: "Reserva de Cancha",
      description: "Pago por reserva de cancha sintética",
      invoice: generateInvoiceNumber(),
      currency: "COP",
      amount: totalValue.toFixed(2), // Asegura que sea un formato válido
      tax_base: "0",
      tax: "0",
      country: "CO",
      lang: "es",
      external: "false",
      response: "https://tusitio.com/respuesta",
      confirmation: "https://tusitio.com/confirmacion",
      method: "popup",
    };

    ePayco.open(paymentData);
  };

  return (
    <div className="payment-container">
      <h2>Completa tu pago</h2>
      
      {loading ? (
        <p>Cargando total...</p>
      ) : (
        <>
          <p>Total a pagar: COP {totalValue}</p>
          <button onClick={handleFullScreenPayment} className="payment-button">
            Pagar ahora
          </button>
        </>
      )}
    </div>
  );
};

export default PaymentMethod;
