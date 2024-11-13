import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./PaymentMethod.css";

const PaymentMethod = () => {
  const generateInvoiceNumber = () => {
    return `INV-${uuidv4()}`;
  };

  // Funciones para habilitar/deshabilitar Datadog RUM
  const disableDatadog = () => {
    if (window.DD_RUM) {
      window.DD_RUM.stopSession();
      console.log("Datadog deshabilitado");
    }
  };

  const enableDatadog = () => {
    if (window.DD_RUM) {
      window.DD_RUM.startSession();
      console.log("Datadog habilitado");
    }
  };

  // Configurar ePayco globalmente para reutilizar
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

  // Método de pago embebido (dispositivos móviles)
  const handleEmbeddedPayment = () => {
    const ePayco = configureEpayco();
    if (!ePayco) return;

    const paymentData = {
      name: "Reserva de Cancha",
      description: "Pago por reserva de cancha sintética",
      invoice: generateInvoiceNumber(),
      currency: "COP",
      amount: "50000",
      tax_base: "0",
      tax: "0",
      country: "CO",
      lang: "es",
      external: "false",
      response: "https://tusitio.com/respuesta",
      confirmation: "https://tusitio.com/confirmacion",
      method: "embedded",
    };

    ePayco.open(paymentData);
  };

  // Método de pago en pantalla completa (PSE)
  const handleFullScreenPayment = () => {
    // Deshabilitar Datadog antes de abrir ePayco
    disableDatadog();

    const ePayco = configureEpayco();
    if (!ePayco) return;

    const paymentData = {
      name: "Reserva de Cancha",
      description: "Pago por reserva de cancha sintética",
      invoice: generateInvoiceNumber(),
      currency: "COP",
      amount: "50000",
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

    // Detectar cuando el popup se cierre y reactivar Datadog
    const interval = setInterval(() => {
      if (document.querySelector(".epayco-overlay") === null) {
        console.log("Pago cerrado");
        enableDatadog();
        clearInterval(interval);
      }
    }, 1000);
  };

  useEffect(() => {
    // Asegurar que ePayco esté disponible
    if (!window.ePayco) {
      console.error("ePayco no está cargado");
    }
  }, []);

  return (
    <div className="payment-container">
      <h2>Completa tu pago</h2>
      <p>Haz clic en el botón para completar tu reserva</p>
      <button onClick={handleEmbeddedPayment} className="payment-button">
        Pagar con ePayco
      </button>
    </div>
  );
};

export default PaymentMethod;
