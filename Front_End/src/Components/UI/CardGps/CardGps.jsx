import React, { useState } from 'react';
import './CardGps.css';
import Select from 'react-select';


const CardGps = () => {
  // Estado para almacenar los filtros seleccionados (array de filtros)
  const [filtrosSeleccionados, setFiltrosSeleccionados] = useState([]);

  // Opciones para el menú desplegable
  const opcionesFiltros = [
    { value: 'precio', label: 'Precio' },
    { value: 'ubicacion', label: 'Ubicación' },
    { value: 'disponibilidad', label: 'Disponibilidad' },
    { value: 'tipoCancha', label: 'Tipo de Cancha' },
    { value: 'servicios', label: 'Servicios' },
  ];

  // Función para manejar el cambio de filtros seleccionados
  const handleFilterChange = (selectedOptions) => {
    setFiltrosSeleccionados(selectedOptions || []);
  };

  return (
    <div className='cardGps'>
      <section className='mapaGps'>
        {/* Aquí va el mapa */}
      </section>

      {/* Menú Desplegable para seleccionar múltiples filtros */}
      <p className='titulo-filtro'>Buscar por filtro</p>
      <div className='filtros'>
        <Select
          isMulti
          options={opcionesFiltros}
          value={filtrosSeleccionados}
          onChange={handleFilterChange}
          className='dropdown-filtro'
          placeholder="Selecciona filtros"
        />
      </div>

      {/* Sección de Precio */}
      {filtrosSeleccionados.some(filtro => filtro.value === 'precio') && (
        <section className='precio'>
          <h3>Precio</h3>
          <div className='precio-contenedor'>
            <input type='number' placeholder='min' />
            <p> - </p>
            <input type='number' placeholder='max' />
          </div>
        </section>
      )}

      {/* Sección de Ubicación */}
      {filtrosSeleccionados.some(filtro => filtro.value === 'ubicacion') && (
        <section className='ubicacion'>
          <h3>Ubicación</h3>
          <input type='text' placeholder='Dirección' />
        </section>
      )}

      {/* Sección de Disponibilidad */}
      {filtrosSeleccionados.some(filtro => filtro.value === 'disponibilidad') && (
        <section className='disponibilidad'>
          <h3>Disponibilidad</h3>
          <div className='a-disponibilidad'>
            <p>Hora</p>
            <input type='text' />
          </div>
          <div className='b-disponibilidad'>
            <div>
              <p>Día</p>
              <input type='number' />
            </div>
            <div>
              <p>Mes</p>
              <input type='number' />
            </div>
            <div>
              <p>Año</p>
              <input type='number' />
            </div>
          </div>
        </section>
      )}

      {/* Sección de Tipo de Cancha */}
      {filtrosSeleccionados.some(filtro => filtro.value === 'tipoCancha') && (
        <section className='tipoCancha'>
          <h3>Tipo de cancha</h3>
          <div className='contenedorTipoCancha'>
            <div>
              <p>Futbol 5</p>
              <input type='checkbox' />
            </div>
            <div>
              <p>Futbol 8</p>
              <input type='checkbox' />
            </div>
            <div>
              <p>Futbol 11</p>
              <input type='checkbox' />
            </div>
          </div>
        </section>
      )}

      {/* Sección de Servicios */}
      {filtrosSeleccionados.some(filtro => filtro.value === 'servicios') && (
        <section className='servicios'>
          <h3>Servicios</h3>
          <div className='servicios-contenedor'>
            <input type='checked' placeholder='Arbitraje' />
            <input type='checked' placeholder='Petos' />
            <input type='checked' placeholder='Iluminación' />
            <input type='checked' placeholder='Balón' />
            <input type='checked' placeholder='Hidratación' />
            <input type='checked' placeholder='Cronómetro' />
            <input type='checked' placeholder='Vestuarios' />
            <input type='checked' placeholder='Duchas' />
            <input type='checked' placeholder='Baños' />
          </div>
        </section>
      )}

      <button>Buscar</button>
    </div>
  );
};

export default CardGps;
