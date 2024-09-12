import React from 'react'
import './OptionMenuRight.css'
import { NavLink } from 'react-router-dom';


const OptionMenuRight = ({content,icon,classNameImg,shade,link}) => {
  return (
    <div className='menu_options_right'>
          <div className={shade}>
          </div>
          <NavLink to={link} className={'actualizar_perfil_right'}>{content} </NavLink>
          <img className={classNameImg} src={icon} alt="" />
    </div>
  )
}

export default OptionMenuRight
