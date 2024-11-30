import React from 'react'
import './ShowManager.css'
import img from '../../../assets/Images/cancha.jpg'

const ShowManager = ({nombres,apellidos,imgManager,nombreBoton,funtionOnClick}) => {
    return (
        <div className='container_manager'>
            <div className='container_data'>
                <div className='container_img'>
                    <img className='img_manager' src={imgManager} alt="" />

                </div>
                <div className='data_manager'>
                    <h3 className='nombres'>{nombres} </h3>
                    <h3 className='apellidos'>{apellidos} </h3>
                </div>
            </div>
            <button onClick={funtionOnClick} className='button_manager'>{nombreBoton} </button>
        </div>
    )
}

export default ShowManager
