import React, { useEffect, useState } from 'react';
import './DeleteFields.css';
import NavBar from '../../UI/NavBar/NavBar';
import { Header } from '../../Layouts/Header/Header';
import fondo_long from '../../../assets/Images/fondos/fondo_long.png';
import { SmallCard } from '../../UI/SmallCard/SmallCard';
import ClienteService from '../../../services/ClienteService'; // Importar el servicio

export const DeleteFields = () => {
  const backgroundStyle = {
    backgroundImage: `url(${fondo_long})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
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

  // Función para eliminar una cancha
  const handleDelete = (fieldId) => {
    const user = JSON.parse(localStorage.getItem('user')); // Obtener el usuario desde el localStorage
    if (!user) {
      console.error("No se pudo obtener la información del usuario.");
      return;
    }

    ClienteService.deleteField(fieldId, user.adminModels.id) // Pasa el ID de la cancha y la empresa
      .then(response => {
        console.log('Cancha eliminada:', response.data);
        // Filtra las canchas eliminadas para actualizar la lista en la interfaz
        const updatedFields = user.adminModels.fields.filter(field => field.id !== fieldId);
        setFields(updatedFields);

        // Actualizar el usuario en el localStorage
        const updatedUser = {
          ...user,
          adminModels: {
            ...user.adminModels,
            fields: updatedFields // Actualiza las canchas en el usuario
          }
        };

        // Guarda el usuario actualizado en el localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Actualiza el estado de usuario para reflejar el cambio
        setUser(updatedUser);
      })
      .catch(error => {
        console.error('Error al eliminar la cancha:', error.response.data);
      });
  };


  return (
    <div style={backgroundStyle} className='container'>
      <Header />

      <main className='main_ShowFields'>
        <h2>Canchas</h2>

        <div className='container-listCards'>
          {/* Si hay más de una cancha, mapea sobre el arreglo y crea una SmallCard para cada una */}
          {fields.length > 0 ? (
            fields.map((field, index) => (
              <SmallCard
                key={index}
                nombreEmpresa={user?.adminModels?.nombreEmpresa || 'Empresa'}
                nombreCancha={field.nombre || 'Cancha'}
              >
                <button className='btn-action' onClick={() => handleDelete(field.id)}>Eliminar</button> {/* Botón para eliminar */}
              </SmallCard>
            ))
          ) : (
            <p>No hay canchas disponibles.</p>
          )}

        </div>
      </main>

      <footer className='footer_empresa'>
        <NavBar />
      </footer>
    </div>
  );
};
