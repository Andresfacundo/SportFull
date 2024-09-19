import React from 'react'
import './ModalExitoso.css'
import checkImg from '../../../assets/Images/2.webp'

const ModalExitoso = () => {
  return (
    
    <div className='container-modal'>
          <div className='check-registro'> <img src={checkImg} className='imgExito'></img> </div>
            <h3 className='titulo-modal'>¡Registro exitoso!</h3>            
            <a href="#">Continuar</a>       
     
        </div>        
  )
}

export default ModalExitoso
