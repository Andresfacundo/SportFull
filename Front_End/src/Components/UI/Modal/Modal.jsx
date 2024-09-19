import React from 'react'
import './Modal.css'
import checkImg from '../../../assets/Images/2.webp'

const Modal = () => {
    return (
        <div className='container-modal-registro'>
            <div className='check'> <img src={checkImg}></img></div>
            <h3 className='titulo-registro'>¡Gracias por registrarse!</h3>
            <p>Para completar tu registro,por favor verifique su direccion de correo electronico o 
                haciendo click en el enlace que hemos enviado a: <br></br> <br></br>Sportfull@gmail.com</p>
            <a href='#' className='btn-volver'>Volver</a>    

            
     
        </div>
    )
}

export default Modal
