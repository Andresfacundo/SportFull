import React from 'react';
import './CardReservation.css';

export const CardReservation = ({ empresa, cancha, fechaReserva, horaInicio, horaFin, estado, asistida,fechaPago }) => {
    // Función para determinar la clase según el estado
  const getStatusClass = (estado) => {
    switch (estado) {
      case 'CANCELADA':
        return 'status-red';
      case 'PENDIENTE':
        return 'status-yellow';
      case 'CONFIRMADA':
        return 'status-green';
      default:
        return '';
    }
  };
  
  
    return (
    <div className='container-card'>
      <div className='tittle-reservation'>
        <h3>Reservación</h3>
        <p>{fechaPago} </p>
      </div>
      <div className='container-description'>
        <div className='container-details'>
          <h4>Empresa: {empresa}</h4>
          <h4>Cancha: {cancha}</h4>
          <h4>Fecha:{fechaReserva} </h4>
          <h4>Hora: {horaInicio} - {horaFin}</h4>
        </div>
        <div className='container-status'>
          <h4>Estado</h4>
          <h4 className={`status ${getStatusClass(estado)}`}>{estado}</h4>
          <h4>Asistida</h4>
          <h4 className='attendance'>{asistida ? 'SI' : 'NO'}</h4>
        </div>
      </div>
    </div>
  );
};
