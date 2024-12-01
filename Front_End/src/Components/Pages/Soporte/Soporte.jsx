import React, { useState } from 'react';
import './Soporte.css'
import { NavLink, useNavigate } from 'react-router-dom';
import ClienteService from '../../../services/ClienteService';
import ModalExitoso from '../../UI/ModalExitoso/ModalExitoso';
import imgSoporte from '../../../assets/Images/icons/icon_soporte.png'
import { Header } from '../../Layouts/Header/Header'

const Soporte = () => {
  
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [nombres, setNombres] = useState('');
  const [email, setEmail] = useState('');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/Login'); // Redirigir a la ruta de login cuando se cierra el modal
  };
  return (
    <div className='contenedor-soporte'>
      <Header />

      <main>
        <h1 className='title_soporte'>Soporte</h1>
        <img className='img-soporte' src={imgSoporte} alt="" />

        {error && <p className="error-message">{error}</p>}

        <form  className='form'>
          <label className='form_label'>
            <input
              type='text'
              placeholder=' '
              className='form_input'
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              required
            />
            <span className='form_text'>Nombre Completo</span>
          </label>


          <label className='form_label'>
            <input
              type='email'
              placeholder=' '
              className='form_input'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className='form_text'>Correo</span>
          </label>

          <label className='form_label'>
            <input
              type='text'
              placeholder=' '
              className='form_input'
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              required
            />
            <span className='form_text'>Asunto</span>
          </label>

          <label className='form_label'>
            <input
              type='text'
              placeholder=' '
              className='form_input'
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
            />
            <span className='form_text'>Mensaje</span>
          </label>



          <button type="submit" className='register'>Registrarse</button>
          <NavLink className='return' to='/'>Volver</NavLink>
        </form>

      </main>

    </div>
  )
}

export default Soporte
