import React from 'react'
import './BtnSupport.css'
import icon_soporte from "../../../assets/Images/icons/icon_soporte.png";
import { NavLink, useNavigate } from 'react-router-dom';


export const BtnSupport = () => {
    return (
        <div>
            <NavLink className='btn_soporte' to='/Soporte'><img src={icon_soporte} alt="" /></NavLink>
        </div>
    )
}
