import React, { useEffect, useState } from 'react';
import './SelectUpdateField.css';
import NavBar from '../../UI/NavBar/NavBar';
import { Header } from '../../Layouts/Header/Header';
import fondo_long from '../../../assets/Images/fondos/fondo_long.png';
import { SmallCard } from '../../UI/SmallCard/SmallCard';
import ClienteService from '../../../services/ClienteService'; // Importar el servicio
import { useNavigate } from 'react-router-dom';

export const SelectUpdateField = () => {
    const backgroundStyle = {
        backgroundImage: `url(${fondo_long})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
        width: '100%',
    };

    const navigate = useNavigate(); // Para redirigir

    // Función para manejar la actualización de una cancha
    const handleUpdate = (field) => {
        // Redirigir a la página de actualización, pasando el ID de la cancha
        navigate(`/UpdateField/${field.id}`); 
    };

    // Hook para el estado de usuario
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [fields, setFields] = useState(user?.adminModels?.fields || []);

    // Efecto para actualizar el estado cuando el localStorage cambie
    useEffect(() => {
        const handleStorageChange = () => {
            const updatedUser = JSON.parse(localStorage.getItem('user'));
            setUser(updatedUser);
            setFields(updatedUser?.adminModels?.fields || []); // Actualiza el estado de las canchas
        };

        // Agrega un listener para cambios en el localStorage
        window.addEventListener('storage', handleStorageChange);

        // Limpieza del listener al desmontar el componente
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

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
                            <button className='btn-action' onClick={() => handleUpdate(field)}>Actualizar</button> {/* Botón para actualizar */}
                        </SmallCard>
                    ))
                ) : (
                    <p>No hay canchas disponibles.</p>
                )}
            </main>
        </div>
    );
};

