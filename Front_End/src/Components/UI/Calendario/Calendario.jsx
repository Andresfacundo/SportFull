import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendario.css';
import { es } from 'date-fns/locale';
import { format, parse } from 'date-fns';

const horas = Array.from({ length: 24 }, (_, i) => `${i}:00`);

const Calendario = () => {
  const [fecha, setFecha] = useState(new Date());
  const [citas, setCitas] = useState({});

  const agendarCita = (hora) => {
    const nombre = prompt("Ingresa tu nombre:");
    if (nombre) {
      const key = `${format(fecha, 'eeeeee dd MMMM yyyy', { locale: es })} ${hora}`;
      setCitas((prevCitas) => ({
        ...prevCitas,
        [key]: nombre,
      }));
    }
  };

  const eliminarCita = (key) => {
    setCitas((prevCitas) => {
      const newCitas = { ...prevCitas };
      delete newCitas[key];
      return newCitas;
    });
  };

  const manejarCambioFecha = (nuevaFecha) => {
    setFecha(nuevaFecha);
  };

  const horasDisponibles = horas.filter(hora => {
    const key = `${format(fecha, 'eeeeee dd MMMM yyyy', { locale: es })} ${hora}`;
    return !citas[key];
  });

  return (
    <div className="calendario-container">
      <h1>Calendario</h1>
      <div className="calendario-horas">
        <Calendar
          onChange={manejarCambioFecha}
          value={fecha}
          locale="es" // Establecer el idioma del calendario
        />
        <div className="horarios">
          <h2 className='horarios-disponibles'>Horarios Disponibles</h2>
          {horasDisponibles.length > 0 ? (
            horasDisponibles.map((hora) => (
              <div key={hora} className="hora" onClick={() => agendarCita(hora)}>
                {hora}
              </div>
            ))
          ) : (
            <p>No hay horarios disponibles para esta fecha.</p>
          )}
        </div>
      </div>
      <h2 className='horarios-disponibles'>Citas Agendadas</h2>
      <ul>
        {Object.entries(citas).map(([key, nombre]) => (
          <li key={key}>
            {key}: {nombre}
            <button onClick={() => eliminarCita(key)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Calendario;
