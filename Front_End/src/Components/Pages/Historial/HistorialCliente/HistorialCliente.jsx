import React, { useEffect, useState } from 'react';
import './HistorialCliente.css';
import NavBar from '../../../UI/NavBar/NavBar';
import { Header } from '../../../Layouts/Header/Header';
import fondo_long from '../../../../assets/Images/fondos/fondo_long.png';
import { CardReservation } from '../../../UI/CardReservation/CardReservation';
import ClienteService from '../../../../services/ClienteService';
import { UpdateReservationDate } from '../../../UI/UpdateReservationDate/UpdateReservationDate';

export const HistorialCliente = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [filtros, setFiltros] = useState('TODOS'); // Estado del filtro seleccionado

  const backgroundStyle = {
    backgroundImage: `url(${fondo_long})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    width: '100%',
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id;

        if (!userId) {
          throw new Error('El ID del usuario no está disponible.');
        }

        const response = await ClienteService.getReservationsByUser(userId);

        const formattedReservations = response.data.map((reservation) => {
          const inicio = new Date(reservation.fechaHoraInicio);
          const fin = new Date(reservation.fechaHoraFin);

          const options = { timeZone: 'America/Bogota', hour12: false };
          const formatterDate = new Intl.DateTimeFormat('es-CO', {
            ...options,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
          const formatterTime = new Intl.DateTimeFormat('es-CO', {
            ...options,
            hour: '2-digit',
            minute: '2-digit',
          });

          const formatDate = (date) =>
            formatterDate.format(date).split('/').reverse().join('-');
          const formatTime = (date) =>
            formatterTime.format(date).replace(':', ':');

          return {
            ...reservation,
            fechaReserva: formatDate(inicio),
            horaInicio: formatTime(inicio),
            horaFin: formatTime(fin),
          };
        });

        setReservations(formattedReservations);
      } catch (error) {
        console.error('Error al obtener el historial de reservas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleReservationClick = (reservation) => {
    if (reservation.estado === 'CONFIRMADA' || reservation.estado === 'PENDIENTE'  ) {
      setSelectedReservation(reservation);
      setModalOpen(true);
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    if (filtros === 'TODOS' || filtros === '') return true;
    return reservation.estado === filtros;
  });

  const reservationCountMessage =
  filtros === 'TODOS' || filtros === ''
    ? `Has realizado ${filteredReservations.length} reservas`
    : filteredReservations.length > 0
    ? `Hay ${filteredReservations.length} reservas de tipo: ${filtros}`
    : `No hay reservas de tipo: ${filtros}`;

  if (loading) {
    return <div className="loading">Cargando historial de reservas...</div>;
  }

  if (reservations.length === 0) {
    return (
      <div style={backgroundStyle} className="container">
        <Header />
        <main className="main_historialClient">
          <h2 className="title_historialClient">Historial</h2>
          <p>No tienes reservas registradas.</p>
        </main>
      </div>
    );
  }

  return (
    <div style={backgroundStyle} className="container">
      <Header />
      <main className="main_historialClient">
        <h2 className="title_historialClient">Historial</h2>

        <div className="filter-type-container">
          <p className="title-filter">Filtrar</p>
          <div className="container_types_filter">
            <label className="radio-option-filter">
              <input
                type="radio"
                name="accountType"
                value="PENDIENTE"
                onChange={(e) => setFiltros(e.target.value)}
              />
              <span className="custom-radio-filter"></span>
              Pendiente
            </label>
            <label className="radio-option-filter">
              <input
                type="radio"
                name="accountType"
                value="CONFIRMADA"
                onChange={(e) => setFiltros(e.target.value)}
              />
              <span className="custom-radio-filter"></span>
              Confirmada
            </label>
            <label className="radio-option-filter">
              <input
                type="radio"
                name="accountType"
                value="CANCELADA"
                onChange={(e) => setFiltros(e.target.value)}
              />
              <span className="custom-radio-filter"></span>
              Cancelada
            </label>
            <label className="radio-option-filter">
              <input
                type="radio"
                name="accountType"
                value="TODOS"
                checked={filtros === 'TODOS'}
                onChange={(e) => setFiltros(e.target.value)}
              />
              <span className="custom-radio-filter"></span>
              Todos
            </label>
          </div>
        </div>

        <p className="reservation-count-message">{reservationCountMessage}</p>

        <div className="cards-container">
          {filteredReservations.map((reservation) => (
            <CardReservation
              key={reservation.id}
              cancha={reservation.cancha}
              fechaReserva={reservation.fechaReserva}
              estado={reservation.estado}
              fechaPago={reservation.fechaPago}
              horaInicio={reservation.horaInicio}
              horaFin={reservation.horaFin}
              empresa={reservation.empresa}
              costo={reservation.costoTotal}
              id={reservation.id}
              asistida={'NO'}
              onEdit={() => handleReservationClick(reservation)}
            />
          ))}
        </div>
      </main>

      <footer>
        <NavBar/>
      </footer>

      {modalOpen && selectedReservation && (
        <UpdateReservationDate
          reservation={selectedReservation}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};
