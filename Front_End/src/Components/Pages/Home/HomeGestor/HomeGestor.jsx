import React from 'react'
import './HomeGestor.css';
import { Header } from '../../../Layouts/Header/Header';
import fondo_long from '../../../../assets/Images/fondos/fondo_long.png';

export const HomeGestor = () => {
  
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
      
      
      
      
    </div>

  )
}
