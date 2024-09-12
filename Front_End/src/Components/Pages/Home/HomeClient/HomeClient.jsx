import React, { useState, useEffect } from 'react';
import './HomeClient.css';
import fondo_long from '../../../../assets/Images/fondos/fondo_long.png';
import foto_perfil from '../../../../assets/Images/icons/avatar_01.png';
import icon_setting from '../../../../assets/Images/icons/icon_setting.png';
import icon_notification from '../../../../assets/Images/icons/icon_notificacion.png';
import icon_logout from '../../../../assets/Images/icons/salida.png';
import icon_01 from '../../../../assets/Images/icons/jugador_04.png';
import icon_02 from '../../../../assets/Images/icons/jugador_03.png';
import icon_03 from '../../../../assets/Images/icons/jugador_01.png';
import icon_04 from '../../../../assets/Images/icons/jugador_05.png';
import OptionMenuLeft from '../../../UI/OptionMenuLeft/OptionMenuLeft';
import OptionMenuRight from '../../../UI/OptionMenuRight/OptionMenuRight';
import { NavLink } from 'react-router-dom';
import Barra from '../../../UI/Barra/Barra';
import ClienteService from '../../../../services/ClienteService';


export const HomeClient = () => {
  const backgroundStyle = {
    backgroundImage: `url(${fondo_long})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    width: '100%',
  };

  // Obtener la fecha actual formateada
  const fechaActual = new Date();
  const opciones = { weekday: 'long', month: 'long', day: 'numeric' };
  let fechaFormateada = fechaActual.toLocaleDateString('es-ES', opciones);

  // Eliminar el año del formato
  fechaFormateada = fechaFormateada.replace(/de \d{4}/, '').trim();

  //obtener datos del usuario
  const user = JSON.parse(localStorage.getItem('user'));  // Obtiene la cadena JSON desde el localStorage

  // Función para obtener la primera palabra y la primera letra de la segunda palabra
  const nombreCompleto = user.nombreCompleto;

  const obtenerResultado = (cadena) => {
    const palabras = cadena.split(" ");
    if (palabras.length > 1) {
      return `${palabras[0]} ${palabras[1][0]}`;
    }
    return palabras[0]; // Si solo hay una palabra, retornarla
  };

  const resultado = obtenerResultado(nombreCompleto);

   // Función para manejar el cierre de sesión
   const handleLogout = () => {
    ClienteService.logout(); // Llama al método logout
    navigate('/Login');  // Redirige al usuario a la página de login
  };

  return (
    <div style={backgroundStyle} className='container_home_client'>
      <header className='header_home'>
        <div className='container_header'>

          <div className='container_options'>
            <h4 className='currentDate'>{fechaFormateada}</h4>
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

      <main>
        <OptionMenuRight link={'/ActualizarCliente'} shade={'shade_perfil'} classNameImg={'icon_1'} icon={icon_01} content={'Perfil'} />
        <OptionMenuLeft link={'/BuscarCanchas'} shade={'shade_field'} classNameImg={'icon_2'} icon={icon_02} content={'Buscar Canchas'} />
        <OptionMenuRight link={'/HistorialCliente'} shade={'shade_historial'} classNameImg={'icon_3'} icon={icon_03} content={'Historial'} />
        <OptionMenuLeft link={'/SoporteCliente'} shade={'shade_support'} classNameImg={'icon_4'} icon={icon_04} content={'Soporte'} />
      </main>

      <footer>
        <Barra/>

      </footer>

    </div>
  );
};
