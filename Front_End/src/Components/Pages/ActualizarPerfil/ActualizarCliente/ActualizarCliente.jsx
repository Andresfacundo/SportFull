import React, { useState, useEffect } from 'react';
import './ActualizarCliente.css'
import { Header } from '../../../Layouts/Header/Header';
import { Main } from '../../../Layouts/Main/Main';
import { NavLink,useNavigate} from 'react-router-dom';
import fondo_long from '../../../../assets/Images/fondos/fondo_long.png';
import ClienteService from '../../../../services/ClienteService';




export const ActualizarCliente = () => {

  const backgroundStyle = {
    backgroundImage: `url(${fondo_long})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: 'auto',
    width: '100%',
  };


  //main

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [cedula, setCedula] = useState(null);
  const [telefono, setTelefono] = useState(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const saveUser = (e) => {
    e.preventDefault();
  
    // Validación básica
    if (!nombreCompleto || !email || !contraseña ) {
      setError("Todos los campos son obligatorios");
      return;
    }
  //obtener datos del usuario
  const user = JSON.parse(localStorage.getItem('user'));  // Obtiene la cadena JSON desde el localStorage

    // Obtén el ID del usuario desde localStorage
    const userId = user.id;
  
    // Crea un objeto con los datos del usuario a actualizar
    const updatedUser = {
      nombreCompleto,
      email,
      contraseña,
      cedula,
      telefono
    };
  
    // Llama al servicio para actualizar el usuario
    ClienteService.updateUser(userId, updatedUser)
      .then((response) => {
        console.log(response.data);
        navigate('/HomeClient'); // Redirige a la página principal después de la actualización
      })
      .catch((error) => {
        console.log(error);
        setError("Ocurrió un error al actualizar el usuario. Inténtalo de nuevo.");
      });
  };
  
  return (
    <div style={backgroundStyle} className='container'>
      <Header/>

      <Main>
        <h2 className='tittle_update'>Actualizar Perfil</h2>
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
          <h2 className='tittle_optional_data'>Datos Opcionales</h2>
          <label className='form_label'>
            <input
              type='password'
              placeholder=' '
              className='form_input'
              value={cedula}  // Asignar el estado
              onChange={(e) => setCedula(e.target.value)}  // Actualizar el estado
              
            />
            <span className='form_text'>Cedula</span>
          </label>
          <label className='form_label'>
            <input
              type='password'
              placeholder=' '
              className='form_input'
              value={telefono}  // Asignar el estado
              onChange={(e) => setTelefono(e.target.value)}  // Actualizar el estado
              
            />
            <span className='form_text'>Telefono</span>
          </label>


          
          <button  className='register'>Actualizar Perfil</button>
          <NavLink className='return' to='/HomeClient'>Volver</NavLink>
        </form>
      </Main>
    </div>
  )
}
