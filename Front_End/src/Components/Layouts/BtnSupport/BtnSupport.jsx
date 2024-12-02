import React from 'react'
import './BtnSupport.css'
import icon_soporte from "../../../assets/Images/icons/icon_soporte.png";
import { NavLink, useLocation } from 'react-router-dom';


export const BtnSupport = () => {
    const location = useLocation(); // Obtén la ruta actual

    return (
        <div>
            <NavLink
                className='btn_soporte'
                to='/Soporte'
                state={{ from: location.pathname }}
            >
                <img src={icon_soporte} alt="" />
            </NavLink>
        </div>
    )
}


