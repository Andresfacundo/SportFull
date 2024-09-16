import React, { useState, useEffect } from 'react';
import './ActualizarCliente.css'
import { Header } from '../../../Layouts/Header/Header';
import { NavLink, useNavigate } from 'react-router-dom';
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

  //main

  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña,setContraseña]= useState('')
  const [cc, setCedula] = useState(null);
  const [telefono, setTelefono] = useState(null);
  const [error, setError] = useState('');
  const [isEditable, setIsEditable] = useState(false);


  const navigate = useNavigate();
    // useEffect para cargar los datos del usuario al montar el componente
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user')); // Obtiene el usuario almacenado en localStorage
  
      if (user) {
        // Cargar los datos del usuario en los estados
        setNombres(user.nombres || '');
        setApellidos(user.apellidos || '');
        setEmail(user.email || '');
        setContraseña(user.contraseña); 
        setCedula(user.clientModels?.cc || ''); // Accede al campo cc dentro de clientModels
        setTelefono(user.clientModels?.telefono || ''); // Accede al campo telefono dentro de clientModels
      }
    }, []);

  const saveUser = (e) => {
    e.preventDefault();

    //___________________________-
    // Validación básica
    if (!nombres || !apellidos || !email ) {
      setError("Todos los campos son obligatorios");
      return;
    }


    //obtener datos del usuario
    const user = JSON.parse(localStorage.getItem('user'));  // Obtiene la cadena JSON desde el localStorage

    // Obtén el ID del usuario desde localStorage
    const userId = user.id;

    // Crea un objeto con los datos del usuario a actualizar
    const updatedUser = {
      nombres,
      apellidos,
      email,
    contraseña,
      clientModels: {
        telefono,
        cc
      }
    };

    // Llama al servicio para actualizar el usuario
    ClienteService.updateUser(userId, updatedUser)
      .then((response) => {
        console.log(response.data);

        // Actualizar el objeto user en localStorage con los datos actualizados
        const newUser = {
          ...user, // Mantiene cualquier dato previo en el objeto 'user' que no se esté actualizando
          nombres,  // Actualizar el campo 'nombres' con los nuevos datos
          apellidos, // Actualizar el campo 'apellidos'
          email,  
          contraseña,   // Actualizar el campo 'email'
          clientModels: {
            telefono,
            cc
          }
        };

        // Guardar el nuevo objeto actualizado en localStorage
        localStorage.setItem('user', JSON.stringify(newUser));

        navigate('/HomeClient'); // Redirige a la página principal después de la actualización
      })
      .catch((error) => {
        console.log(error);
        setError("Ocurrió un error al actualizar el usuario. Inténtalo de nuevo.");
      });
  };

  return (
    <div style={backgroundStyle} className='container'>
      <Header />

      <main>

        <h2 className='tittle_update'>Actualizar Perfil</h2>
        <form onSubmit={saveUser} className='form'>
          <label className='form_label'>
            <input
              type='text'
              placeholder=' '
              className='form_input'
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              disabled={!isEditable} 
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
              disabled={!isEditable} 
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
              disabled={true}
              required
            />
            <span className='form_text'>Correo</span>
          </label>

          <h2 className='tittle_optional_data'>Datos Opcionales</h2>
          <label className='form_label'>
            <input
              type='number'
              placeholder=' '
              className='form_input'
              value={cc}  // Asignar el estado
              onChange={(e) => setCedula(e.target.value)}  // Actualizar el estado
              disabled={!isEditable} 

            />
            <span className='form_text'>Cedula</span>
          </label>
          <label className='form_label'>
            <input
              type='number'
              placeholder=' '
              className='form_input'
              value={telefono}  // Asignar el estado
              onChange={(e) => setTelefono(e.target.value)}  // Actualizar el estado
              disabled={!isEditable} 

            />
            <span className='form_text'>Telefono</span>
          </label>

          <NavLink className={'changePassword'} to='/HomeClient'>Configuración Avanzada</NavLink>


          <button
  className='register'
  onClick={(e) => {
    e.preventDefault(); // Evita el envío del formulario de inmediato
    if (!isEditable) {
      setIsEditable(true); // Habilita los inputs
    } else {
      saveUser(e); // Llama a la función de guardado si ya están habilitados
    }
  }}
>
  {isEditable ? 'Guardar Cambios' : 'Actualizar Perfil'}
</button>

          <NavLink className='return' to='/HomeClient'>Volver</NavLink>
        </form>
      </main>
    </div>
  )
}