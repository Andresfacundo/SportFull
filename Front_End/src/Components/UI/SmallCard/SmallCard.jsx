import React from 'react';
import './SmallCard.css';
import img from '../../../assets/Images/cancha.jpg';
import imgStar from '../../../assets/Images/ball.png';

export const SmallCard = ({ nombreCancha, nombreEmpresa, onClick, children }) => {
  return (
    <div className='Card' onClick={onClick}> {/* Hacemos que toda la card sea clickeable */}

      <div className='content-img'>
        <h3 className='Titulo'>{nombreEmpresa}</h3>
        <img src={img} className='img_cancha' alt="Imagen cancha" />
      </div>

      <div className='content-links'>
        <div className="bottom-section">
          <div className='container-star'>
            <img src={imgStar} className='imgStar' alt="Estrella" />
            <span className="title">{nombreCancha}</span>
            <img src={imgStar} className='imgStar' alt="Estrella" />
          </div>

          <div className="row-row1">
            {children}
          </div>
        </div>
      </div>

    </div>
  );
};
