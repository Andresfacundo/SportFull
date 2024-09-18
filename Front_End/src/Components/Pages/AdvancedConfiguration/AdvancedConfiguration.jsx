import React from 'react'
import './AdvancedConfiguration.css'
import fondo_long from '../../../../src/assets/Images/fondos/fondo_long.png';
import { Header } from '../../../Components/Layouts/Header/Header';
import OptionMenuLeft from '../../../Components/UI/OptionMenuLeft/OptionMenuLeft';
import OptionMenuRight from '../../../Components/UI/OptionMenuRight/OptionMenuRight';
import icon_01 from '../../../assets/Images/icons/jugador_04.png';
import icon_02 from '../../../assets/Images/icons/jugador_03.png';
import { NavLink } from 'react-router-dom';

export const AdvancedConfiguration = () => {
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

      <main className='main_advancedUpdates' >
      <OptionMenuRight link={'/ChangePassword'} shade={'shade_password'} classNameImg={'icon_1'} icon={icon_01} content={'Contraseña'} />
      <OptionMenuLeft link={'/PaymentMethod'} shade={'shade_pay'} classNameImg={'icon_2'} icon={icon_02} content={'Metodo Pago'} />
      <NavLink className='return' to='/ActualizarCliente'>Volver</NavLink>

      </main>
      
      
      </div>
  )
}
