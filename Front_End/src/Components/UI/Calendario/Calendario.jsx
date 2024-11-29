import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendario.css';
import ClienteService from '../../../services/ClienteService';

import { es } from 'date-fns/locale';
import { format } from 'date-fns';

const formatearHora = (hora) => {
  // Convierte de hora 24h a 12h (ejemplo: 16 -> 16:00)
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

  // Función para generar las franjas horarias entre apertura y cierre
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

  // Llamar al servicio cuando la fecha cambie
  const manejarCambioFecha = async (nuevaFecha) => {
    setFecha(nuevaFecha);
    setHorasSeleccionadas([]); // Limpiar selección al cambiar la fecha

    // Formatear la fecha seleccionada y hacer la solicitud al backend
    const fechaSeleccionada = format(nuevaFecha, 'yyyy-MM-dd');
    try {
      const response = await ClienteService.getHorariosReservados(cancha.id, fechaSeleccionada);
      // Asumimos que `response.data` contiene las franjas horarias reservadas en formato '16:00-17:00'
      setHorariosReservados(response.data); // Actualizar horarios reservados con los datos del backend
      console.log(response.data);
      
    } catch (error) {
      console.error('Error al obtener los horarios reservados:', error);
    }
  };

  // Función para convertir una franja horaria en formato 'HH:MM-HH:MM' a horas en formato 24 horas
  const convertirFranjaBackend = (franja) => {
    const [horaInicio, horaFin] = franja.split('-');
    return { inicio: parseInt(horaInicio.split(':')[0], 10), fin: parseInt(horaFin.split(':')[0], 10) };
  };

  // Función para verificar si una franja horaria está reservada
  const estaReservada = (franja) => {
    const { inicio, fin } = convertirFranjaBackend(franja);

    // Iterar por todas las franjas reservadas y compararlas
    for (let reservado of horariosReservados) {
      const { inicio: inicioReservado, fin: finReservado } = convertirFranjaBackend(reservado);

      // Verificar si la franja horaria se superpone con alguna de las reservadas
      if (
        (inicio < finReservado && inicio >= inicioReservado) ||
        (fin > inicioReservado && fin <= finReservado)
      ) {
        return true; // La franja está reservada
      }
    }

    return false; // La franja no está reservada
  };

  // Filtrar las franjas horarias disponibles, excluyendo las reservadas
  const filtrarHorariosDisponibles = () => {
    return franjasHorarias.filter((franja) => !estaReservada(franja));
  };

  const seleccionarHora = (franja) => {
    const [inicio, fin] = franja.split('-').map((hora) => parseInt(hora.split(':')[0], 10));

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
    const [inicio, fin] = franja.split('-').map((hora) => parseInt(hora.split(':')[0], 10));

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
          {filtrarHorariosDisponibles().length > 0 ? (
            filtrarHorariosDisponibles().map((franja) => (
              <div
                key={franja}
                className={`hora ${estaSeleccionada(franja) ? 'hora-seleccionada' : ''}`}
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
