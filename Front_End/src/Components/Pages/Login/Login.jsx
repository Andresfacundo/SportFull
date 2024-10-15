import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ClienteService from '../../../services/ClienteService';
import logo from '../../../assets/Images/logo/3.png';
import './Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Para controlar la visibilidad de la contraseña
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
        const { token, user } = response.data;  // Extrae el token y el objeto user de la respuesta
        console.log(response.data);

        // Guarda el token y la información del usuario en el localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));


        // Redirige al usuario según su tipo de usuario
        if (user.tipoUsuario === 'CLIENTE') {
          navigate('/HomeClient');
        } else if (user.tipoUsuario === 'EMPRESA') {
          navigate('/HomeEmpresa');
        } else if (user.tipoUsuario === 'GESTOR') {
          navigate('/HomeGestor');
        } else {
          setError("Tipo de usuario no reconocido.");
        }
      })
      .catch((error) => {
        console.log(error);
        setError("Correo o contraseña incorrectos. Inténtalo de nuevo.");
      });
  };

  return (
    <div className='container-login'>

      <img className='logo' src={logo} alt='img' />

      <main className='main_login'>

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
              type={showPassword ? 'text' : 'password'} // Mostrar u ocultar contraseña
              placeholder=' '
              className='form_input'
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
            <span className='form_text'>Contraseña</span>
            {/* Botón del ojo */}
            <span 
              className="password-toggle-icon" 
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: 'pointer', position: 'absolute', right: '60px', top: '53.3%', zIndex: "1000" }}
            >
              <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
            </span>
          </label>

          <NavLink className={'recover_password'} to="/recover-password">¿Olvidó su contraseña?</NavLink>

          <button type="submit" className='login'>Iniciar Sesión</button>
          <NavLink className={'return'} to='/'>Volver</NavLink>
        </form>
      </main>

    </div>
  );
};
