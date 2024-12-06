import React, { useEffect, useState } from 'react';
import './PendingReservations.css';
import ClienteService from '../../../services/ClienteService';
import { Header } from '../../../Components/Layouts/Header/Header';
import fondo_long from '../../../assets/Images/fondos/fondo_long.png';
import { SmallCard } from '../../UI/SmallCard/SmallCard';
import { NavLink, useNavigate } from 'react-router-dom';

export const PendingReservations = () => {

  const backgroundStyle = {
    backgroundImage: `url(${fondo_long})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  };

  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id; // ID del usuario
  useEffect(() => {
    ClienteService.getReservationsByUser(userId)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const pendingReservations = response.data.filter(
            (reservation) => reservation.estado === "PENDIENTE"
          );
          const formattedData = pendingReservations.map((reservation) => ({
            cancha: reservation.cancha,
            empresa: reservation.empresa,
            costoTotal: reservation.costoTotal,
            fechaHoraInicio: reservation.fechaHoraInicio,
            fechaHoraFin: reservation.fechaHoraFin,
            fechaPago: reservation.fechaPago,
            id: reservation.id, // ID de la reserva
          }));
          setFields(formattedData);
        } else {
          setFields([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [userId]);
  return (
    <div style={backgroundStyle} className="container">
      {/* <Header /> */}
      <main className="main_pendingReservations">
        <h2 className="title_pendingReservations">Reservas Pendientes</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : fields.length > 0 ? (
          fields.map((field, index) => (
            <SmallCard
              key={index}
              nombreEmpresa={field.empresa || "Empresa"}
              nombreCancha={field.cancha || "Cancha"}
            >
              <div className="item">
                <span className="big-text"></span>
                <a href="#" className="regular-text">
                  {field.costoTotal}
                </a>
              </div>
              {/* Pasar reservaId y userId mediante `state` */}
              <NavLink
                className="btm-pay"
                to="/PaymentMethod"
                state={{ reservaId: field.id, userId }}> Pagar</NavLink>
            </SmallCard>
          ))
        ) : (
          <p>No hay reservas pendientes.</p>
        )}
        <NavLink className="return" to='/HomeClient'>
          Volver
        </NavLink>
      </main>
    </div>
  );
};
