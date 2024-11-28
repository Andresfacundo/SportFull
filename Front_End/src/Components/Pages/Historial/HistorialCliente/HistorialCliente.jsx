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
  const [modalOpen, setModalOpen] = useState(false); // Estado para abrir el modal
  const [selectedReservation, setSelectedReservation] = useState(null); // Estado para la reserva seleccionada

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
          throw new Error("El ID del usuario no está disponible.");
        }

        const response = await ClienteService.getReservationsByUser(userId);

        const formattedReservations = response.data.map((reservation) => {
          const inicio = new Date(reservation.fechaHoraInicio);
          const fin = new Date(reservation.fechaHoraFin);
        
          // Convertir las fechas y horas a la hora de Colombia (GMT-5)
          const options = { timeZone: "America/Bogota", hour12: false }; // Configuración para formato 24 horas
          const formatterDate = new Intl.DateTimeFormat("es-CO", { ...options, year: "numeric", month: "2-digit", day: "2-digit" });
          const formatterTime = new Intl.DateTimeFormat("es-CO", { ...options, hour: "2-digit", minute: "2-digit" });
        
          const formatDate = (date) => formatterDate.format(date).split("/").reverse().join("-"); // Formato YYYY-MM-DD
          const formatTime = (date) => formatterTime.format(date).replace(":", ":"); // Formato HH:MM
        
          return {
            ...reservation,
            fechaReserva: formatDate(inicio), // Fecha en formato YYYY-MM-DD
            horaInicio: formatTime(inicio), // Hora de inicio en formato HH:MM
            horaFin: formatTime(fin), // Hora de fin en formato HH:MM
          };
        });

        setReservations(formattedReservations);
      } catch (error) {
        console.error("Error al obtener el historial de reservas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleReservationClick = (reservation) => {
    if (reservation.estado === "CONFIRMADA") {
      setSelectedReservation(reservation); // Guarda la reserva seleccionada
      setModalOpen(true); // Abre el modal
    }
  };

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
        <div className="cards-container">
          {reservations.map((reservation) => (
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
              onEdit={() => handleReservationClick(reservation)} // Pasa la función de clic para editar la fecha
            />
          ))}
        </div>
      </main>

      {modalOpen && selectedReservation && (
        <UpdateReservationDate
          reservation={selectedReservation} // Pasa la reserva seleccionada al modal
          onClose={() => setModalOpen(false)} // Cierra el modal
        />
      )}
    </div>
  );
};
