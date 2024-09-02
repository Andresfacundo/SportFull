import React, { useState } from 'react';
import { Header } from '../../Layouts/Header/Header';
import { Main } from '../../Layouts/Main/Main';
import { NavLink, useNavigate } from 'react-router-dom';
import ClienteService from '../../../services/ClienteService';
import './Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !contraseña) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const credentials = { email, contraseña };

    ClienteService.login(credentials)
      .then((response) => {
        console.log(response.data);
        // Aquí puedes manejar la respuesta del servidor, por ejemplo:
        // - Guardar el token en el localStorage
        // localStorage.setItem('token', response.data.token);
        // - Redirigir al usuario a la página principal
        navigate('/Home');
      })
      .catch((error) => {
        console.log(error);
        setError("Correo o contraseña incorrectos. Inténtalo de nuevo.");
      });
  };

  return (
    <div className='container-login'>
      <Header>
        <img className='logo' src='/public/3.png' alt='img'/>
      </Header> 

      <Main>
        <h1 className='title-login'>Iniciar sesión</h1>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin} className='form'>
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

          <NavLink className={'recover_password'} to="/recover-password">¿Olvidó su contraseña?</NavLink>
        
          <button type="submit" className='login'>Iniciar Sesión</button>
          <NavLink className={'return'} to='/'>Volver</NavLink>
        </form>

      </Main>
    </div>
  );
};