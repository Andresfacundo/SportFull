import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendario.css';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';

// Función para convertir formato de 24 horas a 12 horas con am/pm
const formatearHora = (hora) => {
  const ampm = hora >= 12 ? 'pm' : 'am';
  const hora12 = hora % 12 || 12; // Convertir a formato de 12 horas
  return `${hora12}${ampm}`;
};

// Función para normalizar texto (eliminar acentos y convertir a minúsculas)
const normalizarTexto = (texto) => 
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Eliminar acentos

const Calendario = ({ cancha }) => {
  const [fecha, setFecha] = useState(new Date());
  const [citas, setCitas] = useState({});

  // Extraer valores del objeto cancha
  const horaApertura = cancha.horaApertura;
  const horaCierre = cancha.horaCierre;
  const diasApertura = cancha.diasApertura.map(normalizarTexto); // Normalizar días

  // Generar franjas horarias en formato "8am-9am"
  const generarFranjasHorarias = (apertura, cierre) => {
    const [inicioHora] = apertura.split(':').map(Number);
    const [finHora] = cierre.split(':').map(Number);
    return Array.from({ length: finHora - inicioHora }, (_, i) => {
      const inicio = inicioHora + i;
      const fin = inicio + 1;
      return `${formatearHora(inicio)}-${formatearHora(fin)}`;
    });
  };

  const franjasHorarias = generarFranjasHorarias(horaApertura, horaCierre);

  const agendarCita = (franja) => {
    const nombre = prompt("Ingresa tu nombre:");
    if (nombre) {
      const key = `${format(fecha, 'eeeeee dd MMMM yyyy', { locale: es })} ${franja}`;
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

  const franjasDisponibles = franjasHorarias.filter((franja) => {
    const key = `${format(fecha, 'eeeeee dd MMMM yyyy', { locale: es })} ${franja}`;
    return !citas[key];
  });

  // Función para deshabilitar días no disponibles
  const deshabilitarDias = ({ date }) => {
    const diaNombre = normalizarTexto(format(date, 'EEEE', { locale: es })); // Normalizar el nombre del día
    return !diasApertura.includes(diaNombre); // Comparar con días normalizados
  };

  return (
    <div className="calendario-container">
      <h1>Calendario</h1>
      <div className="calendario-horas">
        <Calendar
          onChange={manejarCambioFecha}
          value={fecha}
          locale="es" // Establecer el idioma del calendario
          tileDisabled={deshabilitarDias} // Deshabilitar días
        />
        <div className="horarios">
          <h2 className="horarios-disponibles">Horarios Disponibles</h2>
          {franjasDisponibles.length > 0 ? (
            franjasDisponibles.map((franja) => (
              <div key={franja} className="hora" onClick={() => agendarCita(franja)}>
                {franja}
              </div>
            ))
          ) : (
            <p>No hay horarios disponibles para esta fecha.</p>
          )}
        </div>
      </div>
      <h2 className="horarios-disponibles">Citas Agendadas</h2>
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
