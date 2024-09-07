import React, { useState } from 'react';
import { Header } from '../../Layouts/Header/Header';
import { Main } from '../../Layouts/Main/Main';
import { NavLink, useNavigate } from 'react-router-dom';
import ClienteService from '../../../services/ClienteService';
import logo from '../../../assets/Images/logo/3.png'

import './SignUp.css';

export const SignUp = () => {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const saveUser = (e) => {
    e.preventDefault();

    // Validación básica
    if (!nombreCompleto || !email || !contraseña || !tipoUsuario) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const user = { nombreCompleto, email, contraseña, tipoUsuario };

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
      <Header className='header'>
        <img className='logo' src={logo} alt='img' />
      </Header>

      <Main>
        <h1 className='title_signUp'>Registrarse</h1>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={saveUser} className='form'>
          <label className='form_label'>
            <input
              type='text'
              placeholder=' '
              className='form_input'
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
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

      </Main>
    </div>
  );
};
