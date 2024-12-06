import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ClienteService from '../../../services/ClienteService';
import logo from '../../../assets/Images/logo/logo_01.png';
import ModalExitoso from '../../UI/ModalExitoso/ModalExitoso';

import './SignUp.css';

export const SignUp = () => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmacionContraseña, setConfirmacionContraseña] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Controla la visibilidad de la contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Controla la visibilidad de la confirmación
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const saveUser = (e) => {
    e.preventDefault();

    // Validación básica
    if (!nombres || !apellidos || !email || !contraseña || !confirmacionContraseña || !tipoUsuario) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Validar que las contraseñas coincidan
    if (contraseña !== confirmacionContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const user = { nombres, apellidos, email, contraseña, tipoUsuario };

    ClienteService.createUser(user)
      .then((response) => {
        console.log(response.data);
        setShowModal(true); // Mostrar el modal tras un registro exitoso
      })
      .catch((error) => {
        console.log(error);
        setError('Ocurrió un error al registrar el usuario. Inténtalo de nuevo.');
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/Login'); // Redirigir a la ruta de login cuando se cierra el modal
  };








  return (
    <div className='signUp'>

      <div className='contenedor-principal'>

        <div className='contenedor-registro-responsivo'>
          <img className='logo-registro' src={logo} alt='img' />
          <h2 className='slogan_register'>Reserva tu pasión, juega sin parar.</h2>

        </div>
        <div className='contenedor-registro-responsivo-two'>

          <h1 className='title_signUp'>Registrarse</h1>

          <main className='main_SignUp'>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={saveUser} className='form'>
              <label className='form_label'>
                <input
                  type='text'
                  placeholder=' '
                  className='form_input'
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  required
                />
                <span className='form_text'>Nombres</span>
              </label>

              <label className='form_label'>
                <input
                  type='text'
                  placeholder=' '
                  className='form_input'
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  required
                />
                <span className='form_text'>Apellidos</span>
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

              {/* Campo de contraseña con icono show/hide condicional */}
              <label className='form_label'>
                <div className='password-input-container'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder=' '
                    className='form_input'
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    required
                  />
                  <span className='form_text'>Contraseña</span>
                  {contraseña && (
                    <span
                      className='password-toggle-icon'
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: 'pointer', position: 'absolute', fontSize: '18px', right: '18px', top: '32%', transform: 'translateY(-50%)' }}
                    >
                      <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                    </span>
                  )}
                </div>
              </label>

              {/* Campo de confirmación de contraseña con icono show/hide condicional */}
              <label className='form_label'>
                <div className='password-input-container'>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder=' '
                    className='form_input'
                    value={confirmacionContraseña}
                    onChange={(e) => setConfirmacionContraseña(e.target.value)}
                    required
                  />
                  <span className='form_text'>Confirmar Contraseña</span>
                  {confirmacionContraseña && (
                    <span
                      className="password-toggle-icon"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ cursor: 'pointer', position: 'absolute', fontSize: '18px', right: '18px', top: '32%', transform: 'translateY(-50%)' }}
                    >
                      <i className={showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                    </span>
                  )}
                </div>
              </label>

              <div>

                
              </div>


            </form>

            {showModal && (
              <ModalExitoso>
                <h3 className='tittle_modal'>Gracias por registrarse</h3>
                <p className='message'>
                  Para completar su registro, por favor verifique su dirección de
                  correo electrónico haciendo clic en el enlace que hemos enviado a:
                </p>
                <p><strong>{email}</strong></p>
                <button className='cancel' onClick={handleCloseModal}>Cerrar</button>
              </ModalExitoso>
            )}

          </main>
        </div>


        <div className='registro-ultima-seccion'>
        <p className='parrafo-tipo-cuenta'>Seleccione el tipo de cuenta</p>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="accountType"
                    value="CLIENTE"
                    checked={tipoUsuario === 'CLIENTE'}
                    onChange={(e) => setTipoUsuario(e.target.value)}
                    required
                  />
                  <span className="custom-radio"></span>
                  Cliente
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="accountType"
                    value="EMPRESA"
                    checked={tipoUsuario === 'EMPRESA'}
                    onChange={(e) => setTipoUsuario(e.target.value)}
                    required
                  />
                  <span className="custom-radio"></span>
                  Empresa
                </label>
          <button type="submit" className='register'>Registrarse</button>
          <NavLink className='return' to='/'>Volver</NavLink>

        </div>

      </div>
    </div>
  );
};
