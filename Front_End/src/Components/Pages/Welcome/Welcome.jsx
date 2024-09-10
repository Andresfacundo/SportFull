import React from 'react'
import { Header } from '../../Layouts/Header/Header'
import fondo from '../../../assets/Images/fondos/fondo_01.png'
import logo from '../../../assets/Images/logo/logo_01.png'
import { Main } from '../../Layouts/Main/Main'
import { NavLink } from 'react-router-dom'
import { Footer } from '../../Layouts/Footer/Footer'
import './Welcome.css'

export const Welcome = () => {
  const backgroundStyle_Welcome = {
    backgroundImage: `url(${fondo})`,
    backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    height: '100%', 
    width: '100%', 
  };
  return (
    
    <div style={backgroundStyle_Welcome} className='container_welcome'>

      <Header>
        <img className='logo_welcome' src={logo} alt='img'/>
      </Header>

      <Main>
        <h1 className='title_Welcome'>Bienvenido</h1>
        <h2 className='slogan'>Reserva tu pasión, juega sin parar.</h2>
        <NavLink className={'option_welcome'} to= '/Guest'>Continuar como INVITADO</NavLink>
        <NavLink className={'option_welcome'} to='/Login'>Iniciar Sesión</NavLink>
        <NavLink className={'option_welcome'} to='/SignUp'>Registrarse</NavLink>
      </Main>

    </div>
  )
}
