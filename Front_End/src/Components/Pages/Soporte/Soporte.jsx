import React, { useState } from 'react';
import './Soporte.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import ClienteService from '../../../services/ClienteService';
import ModalExitoso from '../../UI/ModalExitoso/ModalExitoso';
import imgSoporte from '../../../assets/Images/icons/icon_soporte.png';
import { Header } from '../../Layouts/Header/Header';
import NavBar from '../../UI/NavBar/NavBar';

const Soporte = () => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [nombres, setNombres] = useState('');
  const [email, setEmail] = useState('');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Obtén la ruta anterior desde el estado o establece una predeterminada
  const previousPath = location.state?.from || '/';

  const handleCloseModal = () => {
    setShowModal(false);
    navigate(previousPath); // Redirigir a la ruta anterior
  };

  const sendEmailToSupport = (e) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario
    const request = {
      nombre: nombres,
      correo: email,
      asunto: asunto,
      mensaje: mensaje,
    };

    ClienteService.sendSupportRequest(request)
      .then((response) => {
        console.log('Respuesta del servidor:', response.data);
        navigate(previousPath); // Redirigir a la ruta anterior después de enviar
      })
      .catch((error) => {
        console.error('Error al enviar la solicitud de soporte:', error.response?.data || error.message);
        setError('Error al enviar el mensaje. Por favor, inténtelo de nuevo.');
      });
  };

  return (
    <div className="contenedor-soporte">
      <Header />

      <main>
        <h1 className="title_soporte">Soporte</h1>
        <img className="img-soporte" src={imgSoporte} alt="" />

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={sendEmailToSupport} className="form">
          <label className="form_label">
            <input
              type="text"
              placeholder=" "
              className="form_input"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              required
            />
            <span className="form_text">Nombre Completo</span>
          </label>

          <label className="form_label">
            <input
              type="email"
              placeholder=" "
              className="form_input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="form_text">Correo</span>
          </label>

          <label className="form_label">
            <input
              type="text"
              placeholder=" "
              className="form_input"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              required
            />
            <span className="form_text">Asunto</span>
          </label>

          <label className="form_label">
            <input
              type="text"
              placeholder=" "
              className="form_input"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
            />
            <span className="form_text">Mensaje</span>
          </label>

          <button type="submit" className="register">
            Enviar Mensaje
          </button>
          <NavLink className="return" to={previousPath}>
            Volver
          </NavLink>
        </form>
      </main>

      <footer>
        <NavBar/>
      </footer>

    </div>
  );
};

export default Soporte;
