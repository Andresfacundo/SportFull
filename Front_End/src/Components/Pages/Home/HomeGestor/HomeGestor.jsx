import React from 'react'
import './HomeGestor.css';
import { Header } from '../../../Layouts/Header/Header';
import fondo_long from '../../../../assets/Images/fondos/fondo_long.png';
import icon_01 from '../../../../assets/Images/icons/jugador_04.png';
import icon_02 from '../../../../assets/Images/icons/jugador_03.png';
import icon_03 from '../../../../assets/Images/icons/jugador_01.png';
import icon_04 from '../../../../assets/Images/icons/jugador_05.png';
import OptionMenuLeft from '../../../UI/OptionMenuLeft/OptionMenuLeft';
import OptionMenuRight from '../../../UI/OptionMenuRight/OptionMenuRight';
import NavBar from '../../../UI/NavBar/NavBar'



export const HomeGestor = () => {

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

      <main className='main_gestor'>

        <OptionMenuRight link={'/ActualizarGestor'} shade={'shade_perfil'} classNameImg={'icon_1'} icon={icon_01} content={'Perfil'} />
        <OptionMenuLeft link={'/BuscarCanchas'} shade={'shade_fieldConsult'} classNameImg={'icon_2'} icon={icon_02} content={'Consultar Canchas'} />
        <OptionMenuRight link={'/GestionReservas'} shade={'shade_booking'} classNameImg={'icon_1'} icon={icon_01} content={'Gestionar Reservas'} />

      </main>
{/* 
      <footer>
        <NavBar/>
      </footer> */}

    </div>

  )
}
