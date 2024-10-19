import React from 'react'
import './Guest.css'
import fondo_long from '../../../assets/Images/fondos/fondo_long.png';
import icon_01 from '../../../assets/Images/icons/jugador_04.png';
import icon_02 from '../../../assets/Images/icons/jugador_03.png';
import icon_03 from '../../../assets/Images/icons/jugador_01.png';
import icon_04 from '../../../assets/Images/icons/jugador_05.png';
import OptionMenuLeft from '../../UI/OptionMenuLeft/OptionMenuLeft';
import OptionMenuRight from '../../UI/OptionMenuRight/OptionMenuRight';
import { Header } from '../../../Components/Layouts/Header/Header';


export const Guest = () => {
  const backgroundStyle = {
    backgroundImage: `url(${fondo_long})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    width: '100%',
  };
  return (
    <div style={backgroundStyle} className='container_home_client'>
      <Header />
      <main className='main_homeGuest'>
        <OptionMenuRight link={'/BuscarCanchas'} shade={'shade_consultCourt'} classNameImg={'icon_1'} icon={icon_01} content={'Consultar Cancha'} />
        <OptionMenuLeft link={'/SignUp'} shade={'shade_register'} classNameImg={'icon_2'} icon={icon_02} content={'Registarse'} />
      </main>

    </div>
  )
}
