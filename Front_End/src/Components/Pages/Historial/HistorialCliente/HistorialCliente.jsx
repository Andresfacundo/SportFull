import React, { useEffect, useState } from 'react';
import './HistorialCliente.css';
import NavBar from '../../../UI/NavBar/NavBar';
import { Header } from '../../../Layouts/Header/Header';
import fondo_long from '../../../../assets/Images/fondos/fondo_long.png';
import { CardReservation } from '../../../UI/CardReservation/CardReservation';
import ClienteService from '../../../../services/ClienteService';

export const HistorialCliente = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

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

        // Formatear las fechas y horas
        const formattedReservations = response.data.map((reservation) => {
          const inicio = new Date(reservation.fechaHoraInicio);
          const fin = new Date(reservation.fechaHoraFin);

          return {
            ...reservation,
            fechaReserva: inicio.toISOString().split('T')[0], // Extraer la fecha en formato YYYY-MM-DD
            horaInicio: inicio.toTimeString().slice(0, 5), // Extraer la hora de inicio en formato HH:MM
            horaFin: fin.toTimeString().slice(0, 5), // Extraer la hora de fin en formato HH:MM
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
            />
          ))}
        </div>
      </main>
    </div>
  );
};
