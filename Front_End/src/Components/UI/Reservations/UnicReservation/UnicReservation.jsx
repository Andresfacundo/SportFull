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
  const [modalMessage, setModalMessage] = useState(''); // Estado para el mensaje del modal

  const navigate = useNavigate();

  const handleDateTimeSelect = (selectedDateTime) => {
    setDateTime(selectedDateTime);
  };

  const handleReservation = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      // Mostrar el modal con el mensaje de registro y redirigir a /SignUp
      setModalMessage('Por favor registrese para poder realizar una reserva');
      setShowModal(true);
      setTimeout(() => navigate('/SignUp'), 5000); // Redirigir después de 2 segundos
      return;
    }

    try {
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

      // Mostrar modal de confirmación de reserva
      setModalMessage('Reserva creada exitosamente, por favor realiza tu pago para confimar la reserva');
      setShowModal(true);
      setReservaId(response.data.id);
      console.log('Reserva:', response.data);
    } catch (error) {
      console.error('Error al crear la reserva:', error.response?.data || error.message);
      alert(`Error al crear la reserva: ${error.response?.data || 'Intenta nuevamente.'}`);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);

    if (reservaId) {
      // Redirigir a la página de método de pago si se ha creado una reserva
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
          <h3 className='tittle_modal'>Confirmación</h3>
          <p className='message'>{modalMessage}</p>
          {modalMessage.includes('realiza tu pago') && (
            <button className='cancel' onClick={handleCloseModal}>Realizar pago</button>
          )}
        </ModalExitoso>
      )}
    </div>
  );
};
