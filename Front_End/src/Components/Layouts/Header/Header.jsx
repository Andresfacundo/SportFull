import React from 'react';
import './Header.css';
import icon_logout from '../../../../src/assets/Images/icons/salida.png';
import foto_perfil from '../../../../src/assets/Images/icons/avatar_01.png';
import icon_setting from '../../../../src/assets/Images/icons/icon_setting.png';
import icon_notification from '../../../../src/assets/Images/icons/icon_notificacion.png';
import ClienteService from '../../../services/ClienteService';
import { CurrentDate } from '../../UI/CurrentDate/CurrentDate';
import { NavLink, useLocation } from 'react-router-dom';  // Importa useLocation

export const Header = ({ children }) => {
  
  const location = useLocation();  // Hook para obtener la ruta actual

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    ClienteService.logout(); // Llama al método logout
    navigate('/Login');  // Redirige al usuario a la página de login
  };

  // Obtener datos del usuario
  const user = JSON.parse(localStorage.getItem('user'));  // Obtiene la cadena JSON desde el localStorage

  // Función para obtener la primera palabra del nombre y la primera letra del apellido
  const obtenerResultado = (nombre, apellido) => {
    const showNombre = nombre.trim().split(" ")[0]; // Tomar la primera palabra del nombre
    const showApellido = apellido.trim().split(" ")[0][0]; // Tomar la primera letra de la primera palabra del apellido

    const nombreCapitalizado = showNombre.charAt(0).toUpperCase() + showNombre.slice(1).toLowerCase();
    const apellidoCapitalizado = showApellido.toUpperCase();

    return `${nombreCapitalizado} ${apellidoCapitalizado}.`; // Devolver el nombre capitalizado y la inicial del apellido
  };

  // Validar que 'user' esté disponible antes de acceder a 'nombres' y 'apellidos'
  const nombre = user?.nombres || 'Nombre';
  const apellido = user?.apellidos || 'Apellido';

  // Obtener el resultado formateado solo si la ruta no es /Guest
  const resultado = location.pathname === '/Guest' ? 'Invitado' : obtenerResultado(nombre, apellido);

  return (
    <header className='header_home'>
      <div className='container_header'>

        <div className='container_options'>
          <CurrentDate></CurrentDate>

          {/* Mostrar los iconos solo si no está en la vista /Guest */}
          {location.pathname !== '/Guest' && (
            <>
              <NavLink className={'configuration'}>
                <img className='icon_options' src={icon_setting} alt="Configuración" />
              </NavLink>
              <NavLink className={'notifications'}>
                <img className='icon_options' src={icon_notification} alt="Notificaciones" />
              </NavLink>
              <NavLink to='/Login' onClick={handleLogout} className={'logout'}>
                <img className='icon_logout' src={icon_logout} alt="Cerrar sesión" />
              </NavLink>
            </>
          )}
        </div>

        <div className='container_user'>
          <img className='pefil_pic' src={foto_perfil} alt="Foto de perfil" />
          <h2 className='nameUser'>{resultado}</h2> {/* Mostrar el nombre o "Invitado" si está en /Guest */}
        </div>

      </div>
    </header>
  );
};
