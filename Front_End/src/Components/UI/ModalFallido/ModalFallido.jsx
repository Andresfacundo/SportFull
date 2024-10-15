import React from 'react'
import './ModalFallido.css'
import imgF from '../../../assets/Images/whitex.png'

const ModalFail = () => {
  return (
    <div className='ContainerF'>
        <div> <img src={imgF} className='imgFail'></img></div>
        <h3 className='tituloF'> ¡No te has podido registrar! </h3>
        <a href='#' className='continuarF'> Continuar</a>
      
    </div>
  )
}

export default ModalFail
