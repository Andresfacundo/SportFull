import React, { useEffect, useRef } from 'react';
import './ModalExitoso.css';
import checkImg from '../../../assets/Images/icons/2.webp';

const ModalExitoso = ({ children }) => {
  const modalRef = useRef(null);
  const backModalRef = useRef(null);

  useEffect(() => {
    if (modalRef.current && backModalRef.current) {
      // Ajusta la altura del div de fondo a la altura del modal
      backModalRef.current.style.height = `${modalRef.current.offsetHeight}px`;
    }
  }, [children]); // Ejecuta cuando el contenido del modal cambia

  return (
    <div className="overlay">
      <div className="container-modal" ref={modalRef}>
        <div className="check-registro">
          <img src={checkImg} className="imgExito" alt="Éxito" />
        </div>
        <div className='container_children'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalExitoso;
