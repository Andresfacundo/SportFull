import React from 'react'
import './ModalExitoso.css'
import checkImg from '../../../assets/Images/icons/2.webp'

const ModalExitoso = ({ children }) => {
  return (
    <div className="overlay">
      <div className="container-modal">
        <div className="check-registro">
          <img src={checkImg} className="imgExito" alt="Éxito" />
        </div>
        <div className='container_children' >
          {children}

        </div>
      </div>
    </div>
  );
};


export default ModalExitoso
