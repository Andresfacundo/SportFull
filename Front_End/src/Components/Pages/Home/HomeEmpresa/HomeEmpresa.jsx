import React from 'react'
import { Header } from '../../../Layouts/Header/Header';
import fondo_long from '../../../../assets/Images/fondos/fondo_long.png';
import './HomeEmpresa.css';
import OptionMenuLeft from '../../../UI/OptionMenuLeft/OptionMenuLeft';
import OptionMenuRight from '../../../UI/OptionMenuRight/OptionMenuRight';
import icon_01 from '../../../../assets/Images/icons/jugador_04.png';
import icon_02 from '../../../../assets/Images/icons/jugador_03.png';
import icon_03 from '../../../../assets/Images/icons/jugador_01.png';
import icon_04 from '../../../../assets/Images/icons/jugador_05.png';
import NavBar from '../../../UI/NavBar/NavBar'


export const HomeEmpresa = () => {

  const backgroundStyle = {
    backgroundImage: `url(${fondo_long})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' 
  };
  return (
    <div style={backgroundStyle} className='container'>

      <Header />

      <main className='main_homeEmpresa'>

        <img className='img-left' src={icon_03} alt="" />
        <div className='container-options-admin'>
          <OptionMenuRight link={'/ActualizarEmpresa'} shade={'shade_perfil'} classNameImg={'icon_1'} icon={icon_01} content={'Perfil'} />
          <OptionMenuLeft link={'/GestionCanchas'} shade={'shade_ManageFields'} classNameImg={'icon_2'} icon={icon_02} content={'Gestión Canchas'} />
          <OptionMenuRight link={'/GestionEmpleados'} shade={'shade_ManageReservations'} classNameImg={'icon_3'} icon={icon_03} content={'Gestión Empleados'} />
          <OptionMenuLeft link={'/Soporte'} shade={'shade_dashborad'} classNameImg={'icon_4'} icon={icon_04} content={'Soporte'} />
        </div>
        <img className='img-right' src={icon_03} alt="" />

      </main>
      <footer className='footer_empresa'>
        <NavBar />
      </footer>


    </div>
  )
}
