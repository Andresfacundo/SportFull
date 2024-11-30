import React, { useEffect, useState } from 'react';
import './FieldsList.css';
import { Header } from '../../Layouts/Header/Header';
import fondo_long from '../../../assets/Images/fondos/fondo_long.png';
import { SmallCard } from '../../UI/SmallCard/SmallCard';
import ClienteService from '../../../services/ClienteService';
import NavBar from '../../UI/NavBar/NavBar';
import { BigCard } from '../../UI/BigCard/BigCard'; // Importar el modal

export const FieldsList = () => {
  const backgroundStyle = {
    backgroundImage: `url(${fondo_long})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    width: '100%',
  };

  // Estados para las canchas y posibles errores
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [selectedCancha, setSelectedCancha] = useState(null);

  // Cargar las canchas al montar el componente
  useEffect(() => {
    ClienteService.getAllFields()
      .then((response) => {
        setFields(response.data); // Actualizar estado con las canchas
        setLoading(false); // Desactivar el estado de carga
      })
      .catch((error) => {
        setError(error.message); // Guardar el mensaje de error
        setLoading(false); // Desactivar el estado de carga
      });
  }, []);

  // Función para abrir el modal con la cancha seleccionada
  const handleOpenModal = (cancha) => {
    setSelectedCancha(cancha); // Establecer la cancha seleccionada
    setIsModalVisible(true); // Mostrar el modal
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalVisible(false); // Cerrar el modal
    setSelectedCancha(null); // Limpiar la cancha seleccionada
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error al cargar las canchas: {error}</p>;
  }

  return (
    <div style={backgroundStyle} className='container'>
      <Header />
      
      <main className='main_foundFields'>
        <h2 className='title_foundFields'>Canchas</h2>
        {fields.length > 0 ? (
          fields.map((field, index) => (
            <SmallCard
              key={index}
              nombreEmpresa={field.nombreEmpresa || 'Empresa'}
              nombreCancha={field.nombre || 'Cancha'}
              onClick={() => handleOpenModal(field)} // Pasamos la función al click
            >
              <div className="item">
                <span className="big-text"></span>
                <a href='#' className="regular-text">{field.tipoCancha}</a>
              </div>
              <div className="item">
                <span className="big-text"></span>
                <a href='#' className="regular-text">${field.precio.toFixed(0)}/h</a>
              </div>

            </SmallCard>
          ))
        ) : (
          <p>No hay canchas disponibles.</p>
        )}
      </main>

      {/* Mostrar el modal cuando sea visible */}
      {isModalVisible && selectedCancha && (
        <BigCard cancha={selectedCancha} onClose={handleCloseModal} />
      )}
    </div>
  );
};
