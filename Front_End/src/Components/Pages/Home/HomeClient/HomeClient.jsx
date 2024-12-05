import React, { useState, useEffect } from 'react';
import './HomeClient.css';
import fondo_long from '../../../../assets/Images/fondos/fondo_long.png';
import icon_01 from '../../../../assets/Images/icons/jugador_04.png';
import icon_02 from '../../../../assets/Images/icons/jugador_03.png';
import icon_03 from '../../../../assets/Images/icons/jugador_01.png';
import icon_04 from '../../../../assets/Images/icons/jugador_05.png';
import OptionMenuLeft from '../../../UI/OptionMenuLeft/OptionMenuLeft';
import OptionMenuRight from '../../../UI/OptionMenuRight/OptionMenuRight';
import { Header } from '../../../Layouts/Header/Header';
import { BtnSupport } from '../../../Layouts/BtnSupport/BtnSupport';
import LogoHome from '../../../../assets/Images/logo/logo_01.png'

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
       
      
       

      <main className='main_homeClient'>
        <OptionMenuRight link={'/ActualizarCliente'} shade={'shade_perfil'} classNameImg={'icon_1'} icon={icon_01} content={'Perfil'} right="actualizar_perfil_right"/>
        <OptionMenuLeft link={'/SearchFields'} shade={'shade_field'} classNameImg={'icon_2'} icon={icon_02} content={'Buscar Canchas'}rig="actualizar_perfil_right" />
        <OptionMenuRight link={'/HistorialCliente'} shade={'shade_historial'} classNameImg={'icon_3'} icon={icon_03} content={'Historial'} right="actualizar_perfil_right-two"/>
      </main>

      <BtnSupport />


      <footer className='barra-navegacion'>
        <NavBar/>
      </footer>

    </div>
  );
};
