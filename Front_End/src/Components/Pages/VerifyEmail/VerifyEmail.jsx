import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClienteService from '../../../services/ClienteService';

export const VerifyEmail = () => {
  const { verificationToken } = useParams(); // Recibe el token de la URL
  const [mensaje, setMensaje] = useState('');
  const [verificado, setVerificado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Llamada para verificar el correo electrónico usando el token
    ClienteService.verifyEmail(verificationToken)
      .then((response) => {
        setMensaje('Correo verificado correctamente');
        setVerificado(true); // Marca que el correo fue verificado
      })
      .catch((error) => {
        console.error(error);
        setMensaje('Error al verificar el correo. Inténtalo de nuevo.');
      });
  }, [verificationToken]);

  const handleLoginRedirect = () => {
    navigate('/Login'); // Redirige a la página de login
  };

  return (
    <div className="verify-email-container">
      <h2>{mensaje}</h2>
      {verificado && (
        <button onClick={handleLoginRedirect}>Ir a iniciar sesión</button>
      )}
    </div>
  );
};
