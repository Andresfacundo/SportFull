import React, { useEffect, useState } from 'react';
import './PendingReservations.css';
import ClienteService from '../../../services/ClienteService';
import { Header } from '../../../Components/Layouts/Header/Header';
import fondo_long from '../../../assets/Images/fondos/fondo_long.png';
import { SmallCard } from '../../UI/SmallCard/SmallCard';

export const PendingReservations = () => {

  const backgroundStyle = {
    backgroundImage: `url(${fondo_long})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    width: '100%',
  };

  const [fields, setFields] = useState([]); // Solo los fieldModels de las reservas
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  const user = JSON.parse(localStorage.getItem('user')); // Obtiene el usuario almacenado en localStorage
  const userId = user.id;

  // Cargar las canchas al montar el componente
  useEffect(() => {
    ClienteService.getReservationsByUser(userId) // Llamada a obtener reservas por usuario
      .then((response) => {
        if (response.data && response.data.length > 0) {
          // Filtrar solo las reservas con estado 'PENDIENTE'
          const fieldsData = response.data
            .filter((reservation) => reservation.estadoReserva === 'PENDIENTE') // Filtra solo las reservas con estado PENDIENTE
            .map((reservation) => reservation.fieldModels); // Extraer solo los fieldModels
          setFields(fieldsData);  // Actualizar estado con solo los fieldModels de las reservas pendientes
        } else {
          setFields([]);  // Si no hay reservas, asegurarse de que fields esté vacío
        }
        setLoading(false); // Desactivar el estado de carga
      })
      .catch((error) => {
        setError(error.message); // Guardar el mensaje de error
        setLoading(false); // Desactivar el estado de carga
      });
  }, [userId]); // Dependencia de userId para actualizar cuando cambie

  return (
    <div style={backgroundStyle} className='container'>
      <Header />

      <main className='main_pendingReservations'>
        <h2 className='title_pendingReservations'>Reservas Pendientes</h2>

        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : fields.length > 0 ? (
          fields.map((field, index) => (
            <SmallCard
              key={index}
              nombreEmpresa={field.nombreEmpresa || 'Empresa'}
              nombreCancha={field.nombre || 'Cancha'}
              onClick={() => handleOpenModal(field)} // Pasamos la función al click
            >
              <div className="item">
                <span className="big-text"></span>
                <a href='#' className="regular-text">{field.tipoCancha}</a>
              </div>
              <div className="item">
                <span className="big-text"></span>
                <a href='#' className="regular-text">${field.precio.toFixed(0)}</a>
              </div>
              <div className="item">
                <span className="big-text"></span>
                <a href='#' className="regular-text">{field.estado}</a>
              </div>
            </SmallCard>
          ))
        ) : (
          <p>No hay reservas pendientes.</p>
        )}
      </main>
    </div>
  );
};
