import React, { useState, useEffect } from 'react';
import './ActualizarCliente.css'
import { Header } from '../../../Layouts/Header/Header';
import { CurrentDate } from '../../../UI/CurrentDate/CurrentDate';
import { Main } from '../../../Layouts/Main/Main';
import { NavLink,useNavigate} from 'react-router-dom';
import fondo_long from '../../../../assets/Images/fondos/fondo_long.png';
import ClienteService from '../../../../services/ClienteService';




export const ActualizarCliente = () => {

  const backgroundStyle = {
    backgroundImage: `url(${fondo_long})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    width: '100%',
  };

  //obtener datos del usuario
  const user = JSON.parse(localStorage.getItem('user'));  // Obtiene la cadena JSON desde el localStorage

  // Función para obtener la primera palabra y la primera letra de la segunda palabra
  const showName = user.nombreCompleto;

  const obtenerResultado = (cadena) => {
    const palabras = cadena.split(" ");
    if (palabras.length > 1) {
      return `${palabras[0]} ${palabras[1][0]}`;
    }
    return palabras[0]; // Si solo hay una palabra, retornarla
  };

  const resultado = obtenerResultado(showName);

   // Función para manejar el cierre de sesión
   const handleLogout = () => {
    ClienteService.logout(); // Llama al método logout
    navigate('/Login');  // Redirige al usuario a la página de login
  };


  //main

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmacionContraseña, setConfirmacionContraseña] = useState('');  // Nuevo estado para confirmación
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const saveUser = (e) => {
    e.preventDefault();

    // Validación básica
    if (!nombreCompleto || !email || !contraseña || !confirmacionContraseña || !tipoUsuario) {
      setError("Todos los campos son obligatorios");
      return;
    }

    // Validar que las contraseñas coincidan
    if (contraseña !== confirmacionContraseña) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const user = { nombreCompleto, email, contraseña, tipoUsuario };

    ClienteService.createUser(user)
      .then((response) => {
        console.log(response.data);
        navigate('/HomeClient'); // Redirige al login después del registro exitoso
      })
      .catch((error) => {
        console.log(error);
        setError("Ocurrió un error al Actualizar el usuario. Inténtalo de nuevo.");
      });
  };

  return (
    <div style={backgroundStyle}>
      <Header/>

      <Main>
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
      </Main>
    </div>
  )
}
