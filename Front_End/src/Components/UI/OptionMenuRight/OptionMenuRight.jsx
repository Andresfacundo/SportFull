import React from 'react'
import './OptionMenuRight.css'
import { NavLink } from 'react-router-dom';


const OptionMenuRight = ({content,icon,classNameImg,shade,link,right}) => {
  return (
    <div className='menu_options_right'>
          <div className={shade}>
          </div>
          <NavLink to={link} className={right}>{content} </NavLink>
          <img className={classNameImg} src={icon} alt="" />
    </div>
  )
}

export default OptionMenuRight
