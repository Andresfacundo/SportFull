import React, { useEffect, useState } from 'react';
import './ShowFields.css';
import NavBar from '../../UI/NavBar/NavBar';
import { Header } from '../../Layouts/Header/Header';
import fondo_long from '../../../assets/Images/fondos/fondo_long.png';
import { SmallCard } from '../../UI/SmallCard/SmallCard';
import ClienteService from '../../../services/ClienteService'; // Importar el servicio

export const ShowFields = () => {
    const backgroundStyle = {
        backgroundImage: `url(${fondo_long})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
        width: '100%',
    };

    // Hook para el estado de usuario
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [fields, setFields] = useState(user?.adminModels?.fields || []);

    return (
        <div style={backgroundStyle} className='container'>
            <Header />

            <main className='main_ShowFields'>
                <h2>Canchas</h2>
                {/* Si hay más de una cancha, mapea sobre el arreglo y crea una SmallCard para cada una */}
                {fields.length > 0 ? (
                    fields.map((field, index) => (
                        <SmallCard
                            key={index}
                            nombreEmpresa={user?.adminModels?.nombreEmpresa || 'Empresa'}
                            nombreCancha={field.nombre || 'Cancha'}
                        >
                            <div className="item">
                            <span className="big-text"></span>

                                <a href='#' className="regular-text">{field.tipoCancha}</a>
                            </div>
                            <div className="item">
                            <span className="big-text"></span>

                                <a href='#' className="regular-text">${field.precio.toFixed(0)}</a>
                            </div>
                            <div className="item">
                                <span className="big-text"></span>
                                <a href='#' className="regular-text">{field.estado}</a>
                            </div>
                        </SmallCard>
                    ))
                ) : (
                    <p>No hay canchas disponibles.</p>
                )}
            </main>
        </div>
    )
}
