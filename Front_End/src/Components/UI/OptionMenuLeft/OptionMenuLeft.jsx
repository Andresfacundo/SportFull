import React from 'react'
import './OptionMenuLeft.css'
import { NavLink } from 'react-router-dom';


const OptionMenuLeft = ({content,icon,classNameImg,shade,link,right}) => {
  return (
    <div className='menu_options_left'>
          <img className={classNameImg} src={icon} alt="" />
          <div className='content_option'>
            <div className={shade}></div>
            <NavLink to={link} className={right}>{content} </NavLink>

          </div>
    </div>
  )
}

export default OptionMenuLeft
