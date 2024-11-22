import React from 'react';
import './BigCard.css';
import img from '../../../assets/Images/cancha.jpg';
import { UnicReservation } from '../Reservations/UnicReservation/UnicReservation';
import Calendario from '../Calendario/Calendario';

export const BigCard = ({ cancha, onClose }) => {
  return (
    <div className="modal-background" onClick={onClose}>
      <div className="canchas" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &#10006;
        </button>

        <div className="content-img-canchas">
          <h3 className="visualizadorTitulo">{cancha.nombreEmpresa} </h3>
          <img src={img} className="img-canchas" alt="Cancha" />
        </div>

        <h2 className="titulo-cancha">{cancha.nombre}</h2>

        <section className="descripcion">
          <h3>Tipo de cancha</h3>
          <p>{cancha.tipoCancha}</p>
        </section>
        <section className="precio">
          <h3>Precio</h3>
          <p>${cancha.precio}</p>
        </section>

        <section className="serviciosBigCard">
          <h3>Servicios</h3>
          <div className="serviciosBigCard-btns">
            {cancha.servicios && cancha.servicios.map((servicio, index) => (
              <button className='option' key={index}>{servicio}</button>
            ))}
          </div>
        </section>

        <section className="btn">
        <UnicReservation cancha={cancha} />
        </section>
      </div>
    </div>
  );
};

