import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { stringify, v4 as uuidv4 } from "uuid";
import "./PaymentMethod.css";

const PaymentMethod = () => {
  const location = useLocation();
  const reservaId = location.state?.reservaId;
  const userId = location.state?.userId;

  const [valorTotal, setValorTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTotalValue = async () => {
    try {
      const response = await fetch(`http://localhost:8080/reservas/${reservaId}/valorTotal`);
      if (!response.ok) {
        throw new Error("Error al obtener el valor total de la reserva.");
      }

      const total = await response.json();
      setValorTotal(total); // Guardamos el valor total recibido
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reservaId) {
      fetchTotalValue();
    }
  }, [reservaId]);

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
    if (!ePayco || !valorTotal) return;

    const paymentData = {
      name: "Reserva de Cancha",
      description: `Pago de reserva ID: ${reservaId}`,
      invoice: `INV-${uuidv4()}`,
      currency: "COP",
      amount: valorTotal.toFixed(2),
      tax_base: "0",
      tax: "0",
      country: "CO",
      lang: "es",
      external: "false",
      response: "http://localhost:8080/api/pagos/respuesta",
      confirmation: "http://localhost:8080/api/pagos/confirmacion",
      method: "standard",
    };

    ePayco.open(paymentData);
  };

  if (!reservaId) {
    return <div>Error: No se recibió la ID de la reserva.</div>;
  }

  return (
    <div className="payment-container">
      <h2>Completa tu pago</h2>
      {loading ? (
        <p>Cargando total...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <p>Total a pagar: COP {valorTotal}</p>
          <button onClick={handleFullScreenPayment} className="payment-button" disabled={!valorTotal || loading}>
            Pagar ahora
          </button>
        </>
      )}
    </div>
  );

};

export default PaymentMethod;
