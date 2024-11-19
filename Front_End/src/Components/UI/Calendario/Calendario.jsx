import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendario.css';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';

const formatearHora = (hora) => {
  const ampm = hora >= 12 ? 'pm' : 'am';
  const hora12 = hora % 12 || 12;
  return `${hora12}${ampm}`;
};

const normalizarTexto = (texto) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const Calendario = ({ cancha, onDateTimeSelect }) => {
  const [fecha, setFecha] = useState(new Date());
  const [horasSeleccionadas, setHorasSeleccionadas] = useState([]);

  const horaApertura = cancha.horaApertura;
  const horaCierre = cancha.horaCierre;
  const diasApertura = cancha.diasApertura.map(normalizarTexto);

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

  const manejarCambioFecha = (nuevaFecha) => {
    setFecha(nuevaFecha);
    setHorasSeleccionadas([]); // Limpiar selección al cambiar la fecha
  };

  const seleccionarHora = (franja) => {
    const [inicio, fin] = franja.split('-').map((hora) => {
      const ampm = hora.slice(-2); // 'am' o 'pm'
      const hora24 = parseInt(hora, 10) + (ampm === 'pm' && parseInt(hora, 10) !== 12 ? 12 : 0);
      return hora24;
    });

    const horaYaSeleccionada = horasSeleccionadas.find(
      (seleccionada) => seleccionada.inicio === inicio && seleccionada.fin === fin
    );

    if (horaYaSeleccionada) {
      // Si la hora ya está seleccionada, quítala
      const nuevasHorasSeleccionadas = horasSeleccionadas.filter(
        (seleccionada) => seleccionada.inicio !== inicio || seleccionada.fin !== fin
      );
      setHorasSeleccionadas(nuevasHorasSeleccionadas);
      if (nuevasHorasSeleccionadas.length > 0) {
        enviarFechas(nuevasHorasSeleccionadas);
      } else {
        // Si no quedan horas seleccionadas, enviamos un objeto vacío
        onDateTimeSelect({ fechaHoraInicio: "", fechaHoraFin: "" });
      }
    } else {
      // Validar si es consecutiva antes de agregar
      if (
        horasSeleccionadas.length === 0 ||
        horasSeleccionadas.at(-1).fin === inicio
      ) {
        const nuevasHorasSeleccionadas = [...horasSeleccionadas, { inicio, fin }];
        setHorasSeleccionadas(nuevasHorasSeleccionadas);
        enviarFechas(nuevasHorasSeleccionadas);
      } else {
        alert('Solo puedes seleccionar franjas horarias consecutivas.');
      }
    }
  };

  const enviarFechas = (seleccionadas) => {
    const fechaSeleccionada = format(fecha, 'yyyy-MM-dd');
    const fechaHoraInicio = `${fechaSeleccionada}T${seleccionadas[0].inicio
      .toString()
      .padStart(2, '0')}:00:00`;
    const fechaHoraFin = `${fechaSeleccionada}T${seleccionadas.at(-1).fin
      .toString()
      .padStart(2, '0')}:00:00`;

    onDateTimeSelect({ fechaHoraInicio, fechaHoraFin });
  };

  const deshabilitarDias = ({ date }) => {
    const diaNombre = normalizarTexto(format(date, 'EEEE', { locale: es }));
    return !diasApertura.includes(diaNombre);
  };

  const estaSeleccionada = (franja) => {
    const [inicio, fin] = franja.split('-').map((hora) => {
      const ampm = hora.slice(-2); // 'am' o 'pm'
      const hora24 = parseInt(hora, 10) + (ampm === 'pm' && parseInt(hora, 10) !== 12 ? 12 : 0);
      return hora24;
    });

    return horasSeleccionadas.some(
      (seleccionada) => seleccionada.inicio === inicio && seleccionada.fin === fin
    );
  };

  return (
    <div className="calendario-container">
      <h1>Calendario</h1>
      <Calendar
        onChange={manejarCambioFecha}
        value={fecha}
        locale="es"
        tileDisabled={deshabilitarDias}
      />
      <div className="horarios">
        <h2 className="horarios-disponibles">Horarios Disponibles</h2>
        <div className="container_horas">
          {franjasHorarias.map((franja) => (
            <div
              key={franja}
              className={`hora ${estaSeleccionada(franja) ? 'hora-seleccionada' : ''}`}
              onClick={() => seleccionarHora(franja)}
            >
              {franja}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendario;
