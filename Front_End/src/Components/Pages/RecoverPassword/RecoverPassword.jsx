import React, { useState } from "react";
import ClienteService from "../../../services/ClienteService";
import "./RecoverPassword.css"

const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    ClienteService.recoverPassword(email)
      .then((response) => {
        setMessage(
          "Se ha enviado un correo con las instrucciones para restablecer tu contraseña."
        );
      })
      .catch((err) => {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Ocurrió un error al procesar la solicitud."
        );
      });
  };

  return (
    <div className="recover-password-container">
      <h1>Recuperar Contraseña</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Correo Electrónico:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Ingresa tu correo"
          />
        </label>
        <button type="submit">Enviar</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RecoverPassword;
