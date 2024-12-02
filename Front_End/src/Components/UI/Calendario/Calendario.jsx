import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendario.css';
import ClienteService from '../../../services/ClienteService';

import { es } from 'date-fns/locale';
import { format } from 'date-fns';

const formatearHora = (hora) => {
  const horaFormateada = hora < 10 ? `0${hora}:00` : `${hora}:00`;
  return horaFormateada;
};

const normalizarTexto = (texto) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const Calendario = ({ cancha, onDateTimeSelect }) => {
  const [fecha, setFecha] = useState(new Date());
  const [horariosReservados, setHorariosReservados] = useState([]);
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

  const manejarCambioFecha = async (nuevaFecha) => {
    setFecha(nuevaFecha);
    setHorasSeleccionadas([]);

    const fechaSeleccionada = format(nuevaFecha, 'yyyy-MM-dd');
    try {
      const response = await ClienteService.getHorariosReservados(
        cancha.id,
        fechaSeleccionada
      );
      setHorariosReservados(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error al obtener los horarios reservados:', error);
    }
  };

  const convertirFranjaBackend = (franja) => {
    const [horaInicio, horaFin] = franja.split('-');
    return {
      inicio: parseInt(horaInicio.split(':')[0], 10),
      fin: parseInt(horaFin.split(':')[0], 10),
    };
  };

  const estaReservada = (franja) => {
    const { inicio, fin } = convertirFranjaBackend(franja);

    for (let reservado of horariosReservados) {
      const { inicio: inicioReservado, fin: finReservado } =
        convertirFranjaBackend(reservado);
      if (
        (inicio < finReservado && inicio >= inicioReservado) ||
        (fin > inicioReservado && fin <= finReservado)
      ) {
        return true;
      }
    }

    return false;
  };

  const filtrarHorariosDisponibles = () => {
    return franjasHorarias.filter((franja) => !estaReservada(franja));
  };

  const seleccionarHora = (franja) => {
    const [inicio, fin] = franja.split('-').map((hora) =>
      parseInt(hora.split(':')[0], 10)
    );

    const horaYaSeleccionada = horasSeleccionadas.find(
      (seleccionada) =>
        seleccionada.inicio === inicio && seleccionada.fin === fin
    );

    if (horaYaSeleccionada) {
      const nuevasHorasSeleccionadas = horasSeleccionadas.filter(
        (seleccionada) =>
          seleccionada.inicio !== inicio || seleccionada.fin !== fin
      );
      setHorasSeleccionadas(nuevasHorasSeleccionadas);
      if (nuevasHorasSeleccionadas.length > 0) {
        enviarFechas(nuevasHorasSeleccionadas);
      } else {
        onDateTimeSelect({ fechaHoraInicio: '', fechaHoraFin: '' });
      }
    } else {
      if (
        horasSeleccionadas.length === 0 ||
        horasSeleccionadas.at(-1).fin === inicio
      ) {
        const nuevasHorasSeleccionadas = [
          ...horasSeleccionadas,
          { inicio, fin },
        ];
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
    const fechaHoraFin = `${fechaSeleccionada}T${seleccionadas
      .at(-1)
      .fin.toString()
      .padStart(2, '0')}:00:00`;

    onDateTimeSelect({ fechaHoraInicio, fechaHoraFin });
  };

  const deshabilitarDias = ({ date }) => {
    const diaNombre = normalizarTexto(format(date, 'EEEE', { locale: es }));
    const esFechaPasada = date < new Date().setHours(0, 0, 0, 0);
    return esFechaPasada || !diasApertura.includes(diaNombre);
  };

  const estaSeleccionada = (franja) => {
    const [inicio, fin] = franja.split('-').map((hora) =>
      parseInt(hora.split(':')[0], 10)
    );

    return horasSeleccionadas.some(
      (seleccionada) =>
        seleccionada.inicio === inicio && seleccionada.fin === fin
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
          {filtrarHorariosDisponibles().length > 0 ? (
            filtrarHorariosDisponibles().map((franja) => (
              <div
                key={franja}
                className={`hora ${
                  estaSeleccionada(franja) ? 'hora-seleccionada' : ''
                }`}
                onClick={() => seleccionarHora(franja)}
              >
                {franja}
              </div>
            ))
          ) : (
            <p>No hay franjas horarias disponibles</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendario;
