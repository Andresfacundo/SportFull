import React from 'react'
import './Header.css'
import icon_logout from '../../../../src/assets/Images/icons/salida.png';
import foto_perfil from '../../../../src/assets/Images/icons/avatar_01.png';
import icon_setting from '../../../../src/assets/Images/icons/icon_setting.png';
import icon_notification from '../../../../src/assets/Images/icons/icon_notificacion.png';
import ClienteService from '../../../services/ClienteService';
import { CurrentDate } from '../../UI/CurrentDate/CurrentDate';
import { NavLink } from 'react-router-dom';


export const Header = ({ children }) => {

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    ClienteService.logout(); // Llama al método logout
    navigate('/Login');  // Redirige al usuario a la página de login
  };

  //obtener datos del usuario
  const user = JSON.parse(localStorage.getItem('user'));  // Obtiene la cadena JSON desde el localStorage

  // Función para obtener la primera palabra y la primera letra de la segunda palabra
  const nombre = user.nombres;
  const apellido=user.apellidos

  // Función para obtener la primera palabra del nombre y la primera letra del apellido
const obtenerResultado = (nombre, apellido) => {
  const showNombre = nombre.split(" ")[0]; // Tomar la primera palabra del nombre
  const showApellido = apellido.split(" ")[0][0]; // Tomar la primera letra de la primera palabra del apellido

  // Capitalizar la primera letra del nombre y la primera letra del apellido
  const nombreCapitalizado = showNombre.charAt(0).toUpperCase() + showNombre.slice(1);
  const apellidoCapitalizado = showApellido.toUpperCase();

  return `${nombreCapitalizado} ${apellidoCapitalizado}.`; // Devolver el nombre capitalizado y la inicial del apellido
};


const resultado = obtenerResultado(nombre, apellido);
console.log(resultado);


  return (
    <header className='header_home'>
      <div className='container_header'>

        <div className='container_options'>
          <CurrentDate></CurrentDate>
          <NavLink className={'configuration'}>
            <img className='icon_options' src={icon_setting} alt="" />
          </NavLink>
          <NavLink className={'notifications'}>
            <img className='icon_options' src={icon_notification} alt="" />
          </NavLink>
          <NavLink to='/Login' onClick={handleLogout} className={'logout'}>
            <img className='icon_logout' src={icon_logout} alt="" />
          </NavLink>
        </div>

        <div className='container_user'>
          <img className='pefil_pic' src={foto_perfil} alt="" />
          <h2 className='nameUser'>{resultado} </h2>
        </div>

      </div>

    </header>
  )
}
