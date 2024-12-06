import React from 'react'
import './SearchFields.css'
import { Header } from '../../../Layouts/Header/Header';
import fondo_long from '../../../../assets/Images/fondos/fondo_long.png';
import OptionMenuLeft from '../../../UI/OptionMenuLeft/OptionMenuLeft';
import OptionMenuRight from '../../../UI/OptionMenuRight/OptionMenuRight';
import icon_01 from '../../../../assets/Images/icons/jugador_04.png';
import icon_02 from '../../../../assets/Images/icons/jugador_03.png';
import NavBar from '../../../UI/NavBar/NavBar'
import { BtnSupport } from '../../../Layouts/BtnSupport/BtnSupport';

export const SearchFields = () => {
  const backgroundStyle = {
    backgroundImage: `url(${fondo_long})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <div style={backgroundStyle} className='container'>
      <Header />

      <main className='main_SearchFields'>
        <OptionMenuRight link={'/FieldsList'} shade={'shade_list'} classNameImg={'icon_1'} icon={icon_01} content={'Listar Canchas'} />
        <OptionMenuLeft link={'/CardGps'} shade={'shade_gps'} classNameImg={'icon_2'} icon={icon_02} content={'GPS'} />

      </main>

      <BtnSupport />

      <footer className='footer_empresa'>
        <NavBar />
      </footer>


    </div>
  )
}
