import React, { useState } from 'react';
import './UnicReservation.css';
import ClienteService from '../../../../services/ClienteService';
import Calendario from '../../Calendario/Calendario';
import { NavLink, useNavigate } from 'react-router-dom';


export const UnicReservation = ({ cancha }) => {
  const [dateTime, setDateTime] = useState({ fechaHoraInicio: '', fechaHoraFin: '' });
  const navigate = useNavigate();

  const handleDateTimeSelect = (selectedDateTime) => {
    setDateTime(selectedDateTime);
  };

  const handleReservation = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert('Usuario no autenticado. Por favor, inicia sesión.');
        return;
      }

      const reservationData = {
        reservation: dateTime,
        fieldId: cancha.id,
        adminId: cancha.empresaId,
        clientId: user.id,
        userEmail: user.email,
      };

      const response = await ClienteService.createReservation(
        reservationData.reservation,
        reservationData.fieldId,
        reservationData.adminId,
        reservationData.clientId,
        reservationData.userEmail
      );


      alert('Reserva creada exitosamente.');
      console.log('Reserva:', response.data);
      console.log(response.data.id);
      
      const reservaId = response.data.id 
      navigate('/PaymentMethod', { state: { reservaId } });


    } catch (error) {
      console.error('Error al crear la reserva:', error.response?.data || error.message);
      alert(`Error al crear la reserva: ${error.response?.data || 'Intenta nuevamente.'}`);
    }
  };

  return (
    <div className='container_date'>
      <Calendario cancha={cancha} onDateTimeSelect={handleDateTimeSelect} />
      <button
        className="btn-reservar"
        onClick={handleReservation}
        disabled={!dateTime.fechaHoraInicio || !dateTime.fechaHoraFin}
      >
        Reservar
      </button>
    </div>
  );
};
