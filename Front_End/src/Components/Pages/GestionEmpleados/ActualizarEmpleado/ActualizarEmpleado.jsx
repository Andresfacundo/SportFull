

import React, { useEffect, useState } from 'react';
import './ActualizarEmpleado.css'
import { Header } from '../../../Layouts/Header/Header';
import fondo_long from '../../../../assets/Images/fondos/fondo_long.png';
import ShowManager from '../../../UI/ShowManager/ShowManager';
import ClienteService from '../../../../services/ClienteService'; // Importar el servicio
import { useNavigate } from 'react-router-dom';


export const ActualizarEmpleado = () => {

  const backgroundStyle = {
    backgroundImage: `url(${fondo_long})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    width: '100%',
  };

  const navigate = useNavigate(); // Para redirigir

      // Función para manejar la actualización del gestor
      const handleUpdate = (manager) => {
        // Redirigir a la página de actualización, pasando el ID de la cancha
        navigate(`/EditManager/${manager.id}`); 
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


  return (
    <div style={backgroundStyle} className='container'>
      <Header/>

      <main className='main_Managers'>
        <h2 className='title_manager'>Gestores</h2>

        {/* Si hay más de un gestor , mapea sobre el arreglo y crea una ShowManager para cada uno */}
        {managers.length > 0 ? (
          managers.map((manager, index) => (
            <ShowManager
              key={index}
              nombres={manager.userModels?.nombres || 'nombres'}
              apellidos={manager.userModels?.apellidos || 'apellidos'}
              nombreBoton={'Actualizar'}
              funtionOnClick={() => handleUpdate(manager)}
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
