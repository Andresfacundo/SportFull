import React, { useEffect, useState } from 'react';
import './UpdateReservationDate.css';
import Calendario from '../Calendario/Calendario';
import ClienteService from '../../../services/ClienteService';

export const UpdateReservationDate = ({ reservation, onClose }) => {
    const [cancha, setField] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [dateTime, setDateTime] = useState({ fechaHoraInicio: '', fechaHoraFin: '' });

    const handleDateTimeSelect = (selectedDateTime) => {
        setDateTime(selectedDateTime);
    };

    // Cargar las canchas al montar el componente
    useEffect(() => {
        ClienteService.getFieldById(reservation.canchaId)
            .then((response) => {
                setField(response.data); // Actualizar estado con las canchas
                setLoading(false); // Desactivar el estado de carga
            })
            .catch((error) => {
                setError(error.message); // Guardar el mensaje de error
                setLoading(false); // Desactivar el estado de carga
            });
    }, [reservation.canchaId]);

    const actualizarReserva = async () => {
        if (!dateTime.fechaHoraInicio || !dateTime.fechaHoraFin) {
            alert('Por favor, seleccione una fecha y hora válida.');
            return;
        }

        const requestData = {
            fechaHoraInicio: dateTime.fechaHoraInicio,
            fechaHoraFin: dateTime.fechaHoraFin,
        };

        try {
            const response = await ClienteService.updateReservation(reservation.id, requestData);
            if (response.status === 200) {
                alert('Reserva actualizada exitosamente.');
                onClose(); // Cerrar modal después de actualizar
            }
        } catch (error) {
            console.error('Error al actualizar la reserva:', error);
            alert('Hubo un error al actualizar la reserva.');
        }
    };

    // Verifica que la prop 'reservation' esté disponible
    if (!reservation) {
        return <div>No se encontró la reserva.</div>;
    }

    return (
        <div className="container-updateReservationDate">
            <div className="container-update">
                <button className='close-btn' onClick={onClose}>          &#10006;
                </button> {/* Cierra el modal al hacer clic */}
                <h2>Re-Agendar</h2>
                <div className='details'>
                <p>Reserva ID: {reservation.id}</p>
                <p>Cancha: {reservation.cancha}</p>
                <p>Fecha: {reservation.fechaReserva}</p>
                <p>Hora de Inicio: {reservation.horaInicio}</p>
                <p>Hora de Fin: {reservation.horaFin}</p>

                </div>

                {cancha && (
                    <Calendario cancha={cancha} onDateTimeSelect={handleDateTimeSelect} />
                )}

                <button className='update-reservation' onClick={actualizarReserva}>Actualizar</button>
            </div>
        </div>
    );
};
