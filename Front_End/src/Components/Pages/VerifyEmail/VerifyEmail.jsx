import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClienteService from '../../../services/ClienteService';
import ModalExitoso from '../../UI/ModalExitoso/ModalExitoso';

export const VerifyEmail = () => {
  const [mensaje, setMensaje] = useState('');
  const [verificado, setVerificado] = useState(false);
  const navigate = useNavigate();

  // Función para obtener el token de la query string
  const getQueryParams = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  useEffect(() => {
    const verificationToken = getQueryParams('token'); // Obtén el token de la URL

    if (verificationToken) {
      // Llama al servicio para verificar el correo usando el token
      ClienteService.verifyEmail(verificationToken)
        .then((response) => {
          console.log(response.data);
          setVerificado(true); // Cambia el estado a verificado si la verificación es exitosa
          setMensaje('Verificación de correo electrónico exitosa.');
        })
        .catch((error) => {
          console.error('Error al verificar el correo:', error);
          setMensaje('Error al verificar el correo. Inténtalo de nuevo.');
        });
    } else {
      setMensaje('No se encontró el token de verificación.');
    }
  }, []);

  const handleLoginRedirect = () => {
    navigate('/Login'); // Redirige a la página de login
  };

  return (

    <ModalExitoso>
        {mensaje && <h2>{mensaje}</h2>}
        {verificado ? (
          <button onClick={handleLoginRedirect} className='login_confirmEmail'>Iniciar sesión</button>
        ) : (
          <p>Verificando tu correo electrónico...</p>
        )}
    </ModalExitoso>
  );
};
