import React from 'react'
import fondo from '../../../assets/Images/fondos/fondo_01.png'
import logo from '../../../assets/Images/logo/logo_01.png'
import { NavLink } from 'react-router-dom'
import { Footer } from '../../Layouts/Footer/Footer'
import './Welcome.css'

export const Welcome = () => {
  const backgroundStyle_Welcome = {
    backgroundImage: `url(${fondo})`,
    backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    height: '100vh', 
    width: '100%', 
  };
  return (
    
    <div style={backgroundStyle_Welcome} className='container_welcome'>  
      


      <main className='main_welcome'>
        <div className='main_welcome_sub'>
           <img className='logo_welcome' src={logo} alt='img'/>
           <h1 className='title_Welcome'>Bienvenido</h1>
           <h2 className='slogan'>Reserva tu pasión, juega sin parar.</h2>
        </div>
        <div className='main_welcome_two'>          
            <NavLink className={'option_welcome'} to= '/Guest'>Continuar como INVITADO</NavLink>
            <NavLink className={'option_welcome'} to='/Login'>Iniciar Sesión</NavLink>
            <NavLink className={'option_welcome'} to='/SignUp'>Registrarse</NavLink>          
        </div>        
      </main>
    </div>
  )
}
