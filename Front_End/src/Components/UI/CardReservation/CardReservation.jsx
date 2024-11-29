import React from 'react';
import './CardReservation.css';

export const CardReservation = ({ empresa, cancha, fechaReserva, horaInicio, horaFin, estado, asistida, fechaPago, costo, id, onEdit }) => {
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

  // Función para determinar la clase según la asistencia
  const getStatusAsistencia = (asistida) => {
    switch (asistida) {
      case 'SI':
        return 'status-green';
      case 'NO':
        return 'status-red';
      default:
        return '';
    }
  };

  return (
    <div
      className={`container-card ${estado === 'CONFIRMADA' ? 'clickable' : ''}`}
      onClick={estado === 'CONFIRMADA' ? onEdit : null} // Solo permitir clic si está CONFIRMADA
    >
      <div className="tittle-reservation">
        <h3>Reservación #{id} </h3>
        <p>{fechaPago}</p>
      </div>
      <div className="container-description">
        <div className="container-details">
          <h4>
            Empresa: <span style={{ fontWeight: 'lighter' }}>{empresa}</span>
          </h4>
          <h4>
            Cancha: <span style={{ fontWeight: 'lighter' }}>{cancha}</span>
          </h4>
          <h4>
            Fecha: <span style={{ fontWeight: 'lighter' }}>{fechaReserva}</span>
          </h4>
          <h4>
            Hora: <span style={{ fontWeight: 'lighter' }}>{horaInicio} - {horaFin}</span>
          </h4>
          <h4>
            Costo: <span style={{ fontWeight: 'lighter' }}>{costo}</span>
          </h4>
        </div>
        <div className="container-status">
          <h4>Estado</h4>
          <h4 className={`status ${getStatusClass(estado)}`}>{estado}</h4>
          <h4>Asistida</h4>
          <h4 className={`attendance ${getStatusAsistencia(asistida)}`}>{asistida}</h4>
        </div>
      </div>
    </div>
  );
};
