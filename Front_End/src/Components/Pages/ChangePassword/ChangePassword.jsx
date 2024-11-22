import React, { useState } from 'react';
import './ChangePassword.css';
import fondo_long from '../../../assets/Images/fondos/fondo_long.png';
import { Header } from '../../Layouts/Header/Header';
import { NavLink, useNavigate } from 'react-router-dom';
import ClienteService from '../../../services/ClienteService';
import NavBar from '../../UI/NavBar/NavBar'

export const ChangePassword = () => {
  const backgroundStyle = {
    backgroundImage: `url(${fondo_long})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    width: '100%',
  };

  const [contraseña, setContraseña] = useState('');
  // const [tipoUsuario, setTipoUsuario]=useState('')
  const [confirmacionContraseña, setConfirmacionContraseña] = useState('');
  // Para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false); 
  // Para controlar la visibilidad de la confirmación
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

  const [error, setError] = useState('');
  
  const navigate = useNavigate();


  const savePassword = (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    // Validar que las contraseñas coincidan
    if (contraseña !== confirmacionContraseña) {
      setError("Las contraseñas no coinciden");
      return;
    }
    // Obtener datos del usuario desde localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      setError("Error: Usuario no autenticado.");
      return;
    }

    const userId = user.id;
    const tipoUsuario = user.tipoUsuario;

    // Crea un objeto con la nueva contraseña
    const updatedUser = {
      contraseña
    };

    if (tipoUsuario === 'CLIENTE') {
      // Llama al servicio para actualizar el usuario
      ClienteService.updateClient(userId, updatedUser)
        .then((response) => {
          console.log(response.data);

          // Actualiza el objeto user en localStorage con la nueva contraseña
          const newUser = {
            ...user,
            contraseña
          };

          // Guardar el objeto actualizado en localStorage
          localStorage.setItem('user', JSON.stringify(newUser));

          // Redirigir a la página de actualización de cliente
          navigate('/ActualizarCliente');
        })
        .catch((error) => {
          console.log(error);
          setError("Ocurrió un error al actualizar la contraseña. Inténtalo de nuevo.");
        });
    }else if (tipoUsuario==='EMPRESA') {
            // Llama al servicio para actualizar el usuario
            ClienteService.updateCompany(userId, updatedUser)
            .then((response) => {
              console.log(response.data);
    
              // Actualiza el objeto user en localStorage con la nueva contraseña
              const newUser = {
                ...user,
                contraseña
              };
    
              // Guardar el objeto actualizado en localStorage
              localStorage.setItem('user', JSON.stringify(newUser));
    
              // Redirigir a la página de actualización de cliente
              navigate('/ActualizarEmpresa');
            })
            .catch((error) => {
              console.log(error);
              setError("Ocurrió un error al actualizar la contraseña. Inténtalo de nuevo.");
            });
    }else if (tipoUsuario==='GESTOR') {
            // Llama al servicio para actualizar el usuario
            ClienteService.updateGestor(userId, updatedUser)
            .then((response) => {
              console.log(response.data);
    
              // Actualiza el objeto user en localStorage con la nueva contraseña
              const newUser = {
                ...user,
                
                contraseña
              };
    
              // Guardar el objeto actualizado en localStorage
              localStorage.setItem('user', JSON.stringify(newUser));
    
              // Redirigir a la página de actualización de cliente
              navigate('/ActualizarGestor');
            })
            .catch((error) => {
              console.log(error);
              setError("Ocurrió un error al actualizar la contraseña. Inténtalo de nuevo.");
            });
    }

  };

  return (
    <div style={backgroundStyle} className='container'>
      <Header />
      <main>
        <h2 className='tittle_update'>Cambiar Contraseña</h2>
        <form onSubmit={savePassword} className='form-update'>
           {/* Input de nueva contraseña */}
           <label className='form_label'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder=' '
              className='form_input'
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
            />
            <span className='form_text'>Nueva Contraseña</span>
            {/* Mostrar el ícono solo si hay algo escrito */}
            {contraseña && (
              <span 
                className="password-toggle-icon" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer', position: 'absolute', right: '5%', top: '30%', zIndex: '1000' }}
              >
                <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
              </span>
            )}
          </label>

           {/* Input de confirmar contraseña */}
           <label className='form_label'>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder=' '
              className='form_input'
              value={confirmacionContraseña}
              onChange={(e) => setConfirmacionContraseña(e.target.value)}
              required
            />
            <span className='form_text'>Confirmar Contraseña</span>
            {/* Mostrar el ícono solo si hay algo escrito */}
            {confirmacionContraseña && (
              <span 
                className="password-toggle-icon" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ cursor: 'pointer', position: 'absolute', right: '5%', top: '30%', zIndex: '1000' }}
              >
                <i className={showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
              </span>
            )}
          </label>

          {error && <p className="error_message">{error}</p>} {/* Mostrar mensaje de error si ocurre */}

          <button
            className='register'
            type='submit' // Cambié el tipo a 'submit' para manejar el envío del formulario
          >
            Guardar Cambios
          </button>

          <NavLink className='return' to='/AdvancedConfiguration'>Volver</NavLink>
        </form>
      </main>
      {/* <footer>
        <NavBar/>
      </footer> */}
    </div>
  );
};
