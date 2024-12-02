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
  };
  return (
    <div style={backgroundStyle} className='container'>
      
     <Header/>
      
     <main className='main_homeEmpresa'>
        <OptionMenuRight link={'/ActualizarEmpresa'} shade={'shade_perfil'} classNameImg={'icon_1'} icon={icon_01} content={'Perfil'} />
        <OptionMenuLeft link={'/GestionCanchas'} shade={'shade_ManageFields'} classNameImg={'icon_2'} icon={icon_02} content={'Gestión Canchas'} />
        <OptionMenuRight link={'/GestionEmpleados'} shade={'shade_ManageReservations'} classNameImg={'icon_3'} icon={icon_03} content={'Gestión Empleados'} />
        {/* <OptionMenuLeft link={'/GestionEmpleados'} shade={'shade_ManageEmployees'} classNameImg={'icon_4'} icon={icon_04} content={'Gestión Empleados'} /> */}
        {/* <OptionMenuRight link={'/GestionReportes'} shade={'shade_ManageReports'} classNameImg={'icon_3'} icon={icon_01} content={'Gestión Reportes'} /> */}
        {/* <OptionMenuLeft link={''} shade={'shade_support'} classNameImg={'icon_4'} icon={icon_02} content={'Soporte'} /> */}
      </main>
      <footer>
        <NavBar/>
      </footer>
      
      
    </div>
  )
}
