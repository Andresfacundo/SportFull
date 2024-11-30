import React, { useState } from 'react';
import './UnicReservation.css';
import ClienteService from '../../../../services/ClienteService';
import Calendario from '../../Calendario/Calendario';
import { NavLink, useNavigate } from 'react-router-dom';
import ModalExitoso from '../../ModalExitoso/ModalExitoso';


export const UnicReservation = ({ cancha }) => {
  const [dateTime, setDateTime] = useState({ fechaHoraInicio: '', fechaHoraFin: '' });
  const [showModal, setShowModal] = useState(false);
  const [reservaId, setReservaId] = useState('');

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


      setShowModal(true); // Mostrar el modal tras un registro exitoso
      setReservaId(response.data.id);
      console.log('Reserva:', response.data);
      console.log(response.data.id);
      
      
      
    } catch (error) {
      console.error('Error al crear la reserva:', error.response?.data || error.message);
      alert(`Error al crear la reserva: ${error.response?.data || 'Intenta nuevamente.'}`);
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
  
    // Usa el estado reservaId para la navegación
    if (reservaId) {
      navigate('/PaymentMethod', { state: { reservaId } });
    } else {
      console.error('No se pudo obtener el ID de la reserva');
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
      {showModal && (
          <ModalExitoso>
            <h3 className='tittle_modal'>Confirmación de Reserva</h3>
            <p className='message'>
              Reserva creada exitosamente, por favor realiza tu pago para confimar la reserva
            </p>
            <button className='cancel' onClick={handleCloseModal}>Realizar pago</button>
          </ModalExitoso>
        )}
    </div>

  );
};
