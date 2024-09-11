import React from 'react'
import './OptionMenuLeft.css'
import { NavLink } from 'react-router-dom';


const OptionMenuLeft = ({content,icon,classNameImg,shade,link}) => {
  return (
    <div className='menu_options_left'>
          <img className={classNameImg} src={icon} alt="" />
          <div className={shade}>
          </div>
          <NavLink to={link} className={'actualizar_perfil_left'}>{content} </NavLink>
    </div>
  )
}

export default OptionMenuLeft
