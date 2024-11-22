import React, { useEffect, useState } from 'react';
import './EliminarEmpleado.css'
import { Header } from '../../../Layouts/Header/Header';
import fondo_long from '../../../../assets/Images/fondos/fondo_long.png';
import ShowManager from '../../../UI/ShowManager/ShowManager';
import ClienteService from '../../../../services/ClienteService'; // Importar el servicio


export const EliminarEmpleado = () => {

  const backgroundStyle = {
    backgroundImage: `url(${fondo_long})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    width: '100%',
  };

  // Estado para almacenar los gestores
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const [managers, setManagers] = useState(user?.adminModels?.gestores || []);

  // Efecto para actualizar el estado cuando el localStorage cambie
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('user'));
      setUser(updatedUser);
      setManagers(updatedUser?.adminModels?.gestores || []); // Actualiza el estado de las canchas
    };

    // Agrega un listener para cambios en el localStorage
    window.addEventListener('storage', handleStorageChange);

    // Limpieza del listener al desmontar el componente
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Función para eliminar un gestor 
  const handleDelete = (gestorId) => {
    const user = JSON.parse(localStorage.getItem('user')); // Obtener el usuario desde el localStorage
    if (!user) {
      console.error("No se pudo obtener la información del usuario.");
      return;
    }

    ClienteService.deletedManager(gestorId) // Pasa el ID de la cancha y la empresa
      .then(response => {
        console.log('Gestor Eliminado:', response.data);
        // Filtra las canchas eliminadas para actualizar la lista en la interfaz
        const updatedManagers = user.adminModels.gestores.filter(manager => manager.id !== gestorId);
        setManagers(updatedManagers);

        // Actualizar el usuario en el localStorage
        const updatedUser = {
          ...user,
          adminModels: {
            ...user.adminModels,
            gestores: updatedManagers // Actualiza las canchas en el usuario
          }
        };

        // Guarda el usuario actualizado en el localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Actualiza el estado de usuario para reflejar el cambio
        setUser(updatedUser);
      })
      .catch(error => {
        console.error('Error al eliminar el gestor:', error.response.data);
      });
  };

  return (
    <div style={backgroundStyle} className='container'>
      <Header />

      <main className='main_Managers'>
        <h2 className='title_manager'>Gestores</h2>

        {/* Si hay más de un gestor , mapea sobre el arreglo y crea una ShowManager para cada uno */}
        {managers.length > 0 ? (
          managers.map((manager, index) => (
            <ShowManager
              key={index}
              nombres={manager.userModels?.nombres || 'nombres'}
              apellidos={manager.userModels?.apellidos || 'apellidos'}
              nombreBoton={'Eliminar'}
              funtionOnClick={() => handleDelete(manager.id)}
            >
            </ShowManager>
          ))
        ) : (
          <p>No hay Gestores disponibles.</p>
        )}

      </main>

    </div>
  )
}
