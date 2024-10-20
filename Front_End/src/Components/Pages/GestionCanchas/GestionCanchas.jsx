import React from 'react'
import './GestionCanchas.css'
import { Header } from '../../Layouts/Header/Header';
import fondo_long from '../../../assets/Images/fondos/fondo_long.png';
import icon_01 from '../../../assets/Images/icons/jugador_04.png';
import icon_02 from '../../../assets/Images/icons/jugador_03.png';
import icon_03 from '../../../assets/Images/icons/jugador_01.png';
import icon_04 from '../../../assets/Images/icons/jugador_05.png';
import OptionMenuLeft from '../../UI/OptionMenuLeft/OptionMenuLeft';
import OptionMenuRight from '../../UI/OptionMenuRight/OptionMenuRight';
import NavBar from '../../UI/NavBar/NavBar'


export const GestionCanchas = () => {
    const backgroundStyle = {
        backgroundImage: `url(${fondo_long})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
        width: '100%',
      };
    


    return (
        <div style={backgroundStyle} className='container'>
            <Header />
        <main className='main_gestionCanchas'>
        <OptionMenuRight link={'/AgregarCancha'} shade={'shade_addfield'} classNameImg={'icon_1'} icon={icon_01} content={'Agregar Cancha'} />
        <OptionMenuLeft link={'/ShowFields'} shade={'shade_dropfield'} classNameImg={'icon_2'} icon={icon_02} content={'Eliminar Cancha'} />
        <OptionMenuRight link={'/ShowFields'} shade={'shade_updatefield'} classNameImg={'icon_3'} icon={icon_03} content={'Actualizar Cancha'} />
        <OptionMenuLeft link={'/ShowFields'} shade={'shade_consultfield'} classNameImg={'icon_4'} icon={icon_04} content={'Consultar Canchas'} />

        </main>
        <footer>
        <NavBar/>
      </footer>
        </div>
        
    )
}
