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
import { Header } from '../../../Layouts/Header/Header';
import NavBar from '../../../UI/NavBar/NavBar'

export const HomeClient = () => {
  const backgroundStyle = {
    backgroundImage: `url(${fondo_long})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    width: '100%',
  };

  return (
    <div style={backgroundStyle} className='container_home_client'>
      <Header/>
      <main>
        <OptionMenuRight link={'/ActualizarCliente'} shade={'shade_perfil'} classNameImg={'icon_1'} icon={icon_01} content={'Perfil'} />
        <OptionMenuLeft link={'/BuscarCanchas'} shade={'shade_field'} classNameImg={'icon_2'} icon={icon_02} content={'Buscar Canchas'} />
        <OptionMenuRight link={'/HistorialCliente'} shade={'shade_historial'} classNameImg={'icon_3'} icon={icon_03} content={'Historial'} />
        <OptionMenuLeft link={'/SoporteCliente'} shade={'shade_support'} classNameImg={'icon_4'} icon={icon_04} content={'Soporte'} />
      </main>

      <footer>
        <NavBar/>
      </footer>

    </div>
  );
};
