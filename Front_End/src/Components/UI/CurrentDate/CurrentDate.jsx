import React from 'react'
import './CurrentDate.css'


export const CurrentDate = () => {
    // Obtener la fecha actual formateada
    const fechaActual = new Date();
    const opciones = { weekday: 'long', month: 'long', day: 'numeric' };
    let fechaFormateada = fechaActual.toLocaleDateString('es-ES', opciones);

    // Eliminar el año del formato
    fechaFormateada = fechaFormateada.replace(/de \d{4}/, '').trim();

    return (
        <h4 className='currentDate'>{fechaFormateada}</h4>
    )
}
