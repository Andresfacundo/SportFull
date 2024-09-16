import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ClienteService from '../../../services/ClienteService';
import logo from '../../../assets/Images/logo/3.png'

import './SignUp.css';

export const SignUp = () => {
  const [nombres, setNombres] = useState('');  
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmacionContraseña, setConfirmacionContraseña] = useState('');  
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const saveUser = (e) => {
    e.preventDefault();

    // Validación básica
    if (!nombres || !apellidos ||!email || !contraseña || !confirmacionContraseña || !tipoUsuario) {
      setError("Todos los campos son obligatorios");
      return;
    }

    // Validar que las contraseñas coincidan
    if (contraseña !== confirmacionContraseña) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const user = { nombres,apellidos, email, contraseña, tipoUsuario };

    ClienteService.createUser(user)
      .then((response) => {
        console.log(response.data);
        navigate('/Login'); // Redirige al login después del registro exitoso
      })
      .catch((error) => {
        console.log(error);
        setError("Ocurrió un error al registrar el usuario. Inténtalo de nuevo.");
      });
  };

  return (
    <div className='signUp'>
        <img className='logo' src={logo} alt='img' />
      

      <main className='main_SignUp'>

        <h1 className='title_signUp'>Registrarse</h1>

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

          <label className='form_label'>
            <input
              type='password'
              placeholder=' '
              className='form_input'
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
            <span className='form_text'>Contraseña</span>
          </label>

          <label className='form_label'>
            <input
              type='password'
              placeholder=' '
              className='form_input'
              value={confirmacionContraseña}  // Asignar el estado
              onChange={(e) => setConfirmacionContraseña(e.target.value)}  // Actualizar el estado
              required
            />
            <span className='form_text'>Confirmar Contraseña</span>
          </label>

          <div className="account-type-container">
            <p>Seleccione el tipo de cuenta</p>
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
          </div>

          <button type="submit" className='register'>Registrarse</button>
        <NavLink className='return' to='/'>Volver</NavLink> 
        </form>
      </main>
    </div>
  );
};
