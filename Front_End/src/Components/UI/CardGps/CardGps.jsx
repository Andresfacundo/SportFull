// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import Select from 'react-select';
import imgSearch from '../../../assets/Images/icons/lupa.png';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import fondo_long from '../../../../src/assets/Images/fondos/fondo_long.png';
import { NavLink, useNavigate } from 'react-router-dom';

import "leaflet-routing-machine";
import { Polyline } from "react-leaflet";
import "./CardGps.css";

// Icono personalizado para Leaflet
const icon = new L.Icon({
  iconUrl: "src/assets/Images/icons/icon-ball.png",
  iconSize: [55, 80],
  iconAnchor: [25, 90],
  popupAnchor: [-3, -76],
});

const currentLocationIcon = new L.Icon({
  iconUrl: "src/assets/Images/icons/ubi-actual.png", // Cambia a la ruta de tu ícono
  iconSize: [40, 40], // Tamaño del ícono
  iconAnchor: [20, 40], // Punto de anclaje
});

// Componente para centrar el mapa dinámicamente
const SetViewOnClick = ({ center }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

const CardGps = () => {
  const backgroundStyle = {
    backgroundImage: `url(${fondo_long})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: 'auto',
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem '

  };

  const [busqueda, setBusqueda] = useState("");
  const [filtrosSeleccionados, setFiltrosSeleccionados] = useState([]);
  const [ubicacionActual, setUbicacionActual] = useState({
    lat: 4.533889,
    lng: -75.681389,
  });
  const [geocodedFields, setGeocodedFields] = useState([]);
  const [allUbic, setAllUbic] = useState([]);

  const [precioMin, setPrecioMin] = useState(null);
  const [precioMax, setPrecioMax] = useState(null);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedTiposCancha, setSelectedTiposCancha] = useState([]);
  const [selectedServicios, setSelectedServicios] = useState([]);
  const [ruta, setRuta] = useState(null);
  const [showCurrentLocation, setShowCurrentLocation] = useState(false);
  const [ubicacionReal, setUbicacionReal] = useState({
    lat: 4.533889,
    lng: -75.681389,
  });
  const [allCompanies, setAllCompanies] = useState([]);


  const opcionesFiltros = [
    { value: "precio", label: "Precio" },
    { value: "ubicacion", label: "Ubicación" },
    { value: "disponibilidad", label: "Disponibilidad" },
    { value: "tipoCancha", label: "Tipo de Cancha" },
    { value: "servicios", label: "Servicios" },
  ];

  // Obtener ubicación actual del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUbicacionReal({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setUbicacionActual({ // Mantén el mapa centrado inicialmente en la ubicación real
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => console.log("Error obteniendo ubicación, cargando Armenia por defecto.")
      );
    }
  }, []);

  // Obtener datos del backend y geocodificarlos
  useEffect(() => {
    axios
      .get(`http://localhost:8080/admin/find-all`)
      .then((response) => {
        const dataCompany = response.data;
        setAllCompanies(dataCompany); // Guarda las empresas originales
        // Continúa con la lógica de extracción y geocodificación
        const allFields = dataCompany.flatMap((empresa) =>
          empresa.fields.map((field) => ({
            ...field,
            id_empresa: empresa.id,
            direccionEmpresa: empresa.direccionEmpresa,
            nombreEmpresa: empresa.nombreEmpresa,
          }))
        );
        geocodeFields(allFields); // Llama a la geocodificación
      })
      .catch((error) => {
        console.error("Error al buscar las ubicaciones: ", error);
      });

  }, []);

  //esta función capturá lo que el usuario escriba en el input
  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  //función de búsqueda de empresa
  const handleBusquedaClick = () => {
    setRuta(null);
    setShowCurrentLocation(false); // Asegúrate de ocultar la ubicación actual
    const ubicacionesFiltradas = aplicarFiltros();

    if (ubicacionesFiltradas.length > 0) {
      setFilteredLocations(ubicacionesFiltradas);
      setUbicacionActual({
        lat: ubicacionesFiltradas[0].lat,
        lng: ubicacionesFiltradas[0].lng,
      });
    } else {
      alert("No se encontró ninguna ubicación con los filtros aplicados.");
      setFilteredLocations([]);
    }
  };


  // Manejar cambio en los checkboxes de servicios
  const handleServicioChange = (servicio) => {
    setSelectedServicios(
      (prevServicios) =>
        prevServicios.includes(servicio)
          ? prevServicios.filter((s) => s !== servicio) // Elimina el servicio si ya estaba seleccionado
          : [...prevServicios, servicio] // Agrega el servicio si no estaba seleccionado
    );
  };

  const aplicarFiltros = () => {
    let resultado = allUbic;

    filtrosSeleccionados.forEach((filtro) => {
      switch (filtro.value) {
        case "precio":
          resultado = filtrarPorPrecio(resultado, precioMin, precioMax);
          break;
        case "ubicacion":
          if (busqueda.trim() !== "") {
            resultado = resultado.filter(
              (ubicacion) =>
                ubicacion.nombre
                  ?.toLowerCase()
                  .includes(busqueda.toLowerCase()) ||
                ubicacion.direccion
                  ?.toLowerCase()
                  .includes(busqueda.toLowerCase())
            );
          }
          break;
        case "disponibilidad":
          // Lógica para filtrar por disponibilidad
          break;
        case "tipoCancha":
          // Lógica para filtrar por tipo de cancha
          if (selectedTiposCancha.length > 0) {
            resultado = resultado.filter((ubicacion) => {
              const fields = Array.isArray(ubicacion.fields)
                ? ubicacion.fields
                : [ubicacion.fields];
              return fields.some((field) =>
                selectedTiposCancha.includes(field.tipoCancha)
              );
            });
          }
          break;
        case "servicios":
          // Lógica para filtrar por servicios
          if (selectedServicios.length > 0) {
            resultado = resultado.filter((ubicacion) => {
              if (Array.isArray(ubicacion.fields)) {
                // Revisa cada cancha dentro de la ubicación
                return ubicacion.fields.some((field) => {
                  const serviciosCancha = field.servicios || [];
                  return selectedServicios.every((servicio) =>
                    serviciosCancha.includes(servicio)
                  );
                });
              } else if (
                ubicacion.fields &&
                typeof ubicacion.fields === "object"
              ) {
                // Caso único (fields no es un array)
                const serviciosCancha = ubicacion.fields.servicios || [];
                return selectedServicios.every((servicio) =>
                  serviciosCancha.includes(servicio)
                );
              }
              return false;
            });
          }
          break;
        default:
          break;
      }
    });

    return resultado;
  };

  // const geocodeFields = async (fields) => {
  //   const newLocations = await Promise.all(
  //     fields.map(async (field) => {
  //       try {
  //         const response = await axios.get(
  //           `https://nominatim.openstreetmap.org/search`,
  //           {
  //             params: {
  //               q: field.direccionEmpresa,
  //               format: "json",
  //               addressdetails: 1,
  //               limit: 1,
  //               countrycodes: "CO",
  //             },
  //           }
  //         );

  //         if (response.data.length > 0) {
  //           const location = response.data[0];
  //           return {
  //             lat: parseFloat(location.lat),
  //             lng: parseFloat(location.lon),
  //             nombre: field.nombreEmpresa,
  //             direccion: field.direccionEmpresa,
  //             id_empresa: field.id_empresa,
  //             fields: field, // Asegúrate de incluir la información del campo
  //           };
  //         }
  //         return null;
  //       } catch (error) {
  //         console.error(`Error en la geocodificación: `, error);
  //         return null;
  //       }
  //     })
  //   );

  //   const validLocations = newLocations.filter((location) => location !== null);
  //   setGeocodedFields(validLocations);
  //   setAllUbic(validLocations); // Actualiza allUbic con las ubicaciones geocodificadas
  //   setFilteredLocations(validLocations);
  // };

const geocodeFields = async (fields) => {
  // Imprimir cuántas canchas se están procesando
  console.log(`Procesando ${fields.length} canchas para geocodificación.`);
  
  const newLocations = await Promise.all(
    fields.map(async (field) => {
      try {
        // Verificar si la dirección está disponible antes de hacer la solicitud
        if (!field.direccionEmpresa) {
          console.error(`Dirección faltante para la cancha: ${field.nombreEmpresa}`);
          return null; // Ignorar canchas sin dirección
        }

        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search`,
          {
            params: {
              q: field.direccionEmpresa,
              format: "json",
              addressdetails: 1,
              limit: 1,
              countrycodes: "CO",
            },
          }
        );

        if (response.data.length > 0) {
          const location = response.data[0];
          return {
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lon),
            nombre: field.nombreEmpresa,
            direccion: field.direccionEmpresa,
            id_empresa: field.id_empresa,
            fields: field, // Información del campo
          };
        } else {
          console.warn(`No se encontró geolocalización para la dirección: ${field.direccionEmpresa}`);
          return null; // No se encontró ubicación
        }
      } catch (error) {
        console.error(`Error en la geocodificación de ${field.nombreEmpresa}: `, error);
        return null; // Si ocurre un error, no devolver nada
      }
    })
  );

  // Filtrar solo ubicaciones válidas
  const validLocations = newLocations.filter((location) => location !== null);

  // Actualizar el estado con las ubicaciones geocodificadas válidas
  if (validLocations.length > 0) {
    setGeocodedFields(validLocations);
    setAllUbic(validLocations);
    setFilteredLocations(validLocations); // Asegúrate de mostrar las ubicaciones válidas en el mapa
  } else {
    console.warn("No se pudieron geocodificar canchas válidas.");
  }
};


  

  // Nueva función para filtrar por precio
  const filtrarPorPrecio = (canchas, precioMin, precioMax) => {
    console.log(
      "Canchas a filtrar:",
      canchas.map((ubicacion) => ({
        id: ubicacion.fields?.id,
        nombre: ubicacion.fields?.nombre,
        precio: ubicacion.fields?.precio,
        esArray: Array.isArray(ubicacion.fields),
      }))
    );

    return canchas.filter((ubicacion) => {
      if (Array.isArray(ubicacion.fields)) {
        // Caso: fields es un array
        return ubicacion.fields.some((field) => {
          const precio = parseFloat(field.precio); // Asegura conversión a número
          return (
            (precioMin === null || precio >= precioMin) &&
            (precioMax === null || precio <= precioMax)
          );
        });
      } else if (ubicacion.fields && typeof ubicacion.fields === "object") {
        // Caso: fields es un objeto único
        const precio = parseFloat(ubicacion.fields.precio);
        return (
          (precioMin === null || precio >= precioMin) &&
          (precioMax === null || precio <= precioMax)
        );
      }
      return false; // Caso: fields no existe o no es válido
    });
  };

  //Filtrar por tipo cancha
  const handleTipoCanchaChange = (tipo) => {
    setSelectedTiposCancha(
      (prevTipos) =>
        prevTipos.includes(tipo)
          ? prevTipos.filter((t) => t !== tipo) // Si ya está, lo elimina
          : [...prevTipos, tipo] // Si no está, lo agrega
    );
  };

  const handleFilterChange = (selectedOptions) => {
    setFiltrosSeleccionados(selectedOptions || []);
  };

  //función para calcular ruta
  const calcularRuta = async (ubicacionDestino) => {
    const { lat: origenLat, lng: origenLng } = ubicacionReal;
    const { lat: destinoLat, lng: destinoLng } = ubicacionDestino;

    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${origenLng},${origenLat};${destinoLng},${destinoLat}`,
        {
          params: {
            overview: "full",
            geometries: "geojson",
          },
        }
      );

      const data = response.data;
      if (data.routes.length > 0) {
        setRuta(data.routes[0].geometry);
        setFilteredLocations([
          {
            lat: destinoLat,
            lng: destinoLng,
            nombre: "Destino",
          },
        ]);
        setShowCurrentLocation(true); // Muestra la ubicación actual solo al calcular la ruta
        setUbicacionActual({
          lat: destinoLat,
          lng: destinoLng,
        });
      } else {
        alert("No se encontró una ruta.");
      }
    } catch (error) {
      console.error("Error al calcular la ruta:", error);
      alert("Hubo un problema al calcular la ruta.");
    }
  };



  return (
    <div style={backgroundStyle} className='container'  >
      {/* Mapa */}
      <section className="mapaGps">
        <MapContainer
          center={ubicacionActual}
          zoom={14}
          scrollWheelZoom={true}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <SetViewOnClick center={ubicacionActual} />

          {/* Marcador para la ubicación actual */}
          {showCurrentLocation && (
            <Marker
              position={[ubicacionReal.lat, ubicacionReal.lng]}
              icon={currentLocationIcon}
            >
              <Popup>Tu ubicación actual</Popup>
            </Marker>
          )}

          {/* Mostrar ruta si existe */}
          {ruta && (
            <Polyline
              positions={ruta.coordinates.map(([lng, lat]) => [lat, lng])} // Convierte las coordenadas
              color="blue"
            />
          )}

          {/* Otros marcadores */}
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location, index) => (
              <Marker
                key={index}
                position={[location.lat, location.lng]}
                icon={icon}
              >
                <Popup>{location.nombre}</Popup>
              </Marker>
            ))
          ) : (
            <p>No hay ubicaciones disponibles para mostrar.</p>
          )}
        </MapContainer>
      </section>

      {/* Filtros */}
      <p className="titulo-filtro">Buscar por filtro</p>
      <div className="filtros">
        <Select
          isMulti
          options={opcionesFiltros}
          value={filtrosSeleccionados}
          onChange={handleFilterChange}
          className="dropdown-filtro"
          placeholder="Selecciona filtros"
        />
        <button className="search" onClick={handleBusquedaClick}>
          <img src={imgSearch} alt="" />
        </button>
      </div>

      {/* Secciones dinámicas basadas en filtros */}
      {filtrosSeleccionados.some((filtro) => filtro.value === "precio") && (
        <section className="precio-filter">
          <h3>Precio</h3>
          <div className="precio-contenedor">
            <input
              type="number"
              placeholder="min"
              value={precioMin || ""}
              onChange={(e) => {
                const value = e.target.value
                  ? parseFloat(e.target.value)
                  : null;
                setPrecioMin(value >= 0 ? value : null); // Validar valores positivos
              }}
            />
            <p> - </p>
            <input
              type="number"
              placeholder="max"
              value={precioMax || ""}
              onChange={(e) => {
                const value = e.target.value
                  ? parseFloat(e.target.value)
                  : null;
                setPrecioMax(value >= 0 ? value : null); // Validar valores positivos
              }}
            />
          </div>
        </section>
      )}

      {filtrosSeleccionados.some((filtro) => filtro.value === "ubicacion") && (
        <section className="ubicacion">
          <h3>Nombre-Dirección</h3>
          <input
            type="text"
            placeholder="Nombre-Dirección"
            value={busqueda}
            onChange={handleBusquedaChange}
          />
        </section>
      )}

      {/* {filtrosSeleccionados.some(
        (filtro) => filtro.value === "disponibilidad"
      ) && (
          <section className="disponibilidad">
            <h3>Disponibilidad</h3>
            <div className="a-disponibilidad">
              <p>Hora</p>
              <input type="text" />
            </div>
            <div className="b-disponibilidad">
              <div>
                <p>Día</p>
                <input type="number" />
              </div>
              <div>
                <p>Mes</p>
                <input type="number" />
              </div>
              <div>
                <p>Año</p>
                <input type="number" />
              </div>
            </div>
          </section>
        )} */}

      {filtrosSeleccionados.some((filtro) => filtro.value === "tipoCancha") && (
        <section className="tipoCancha">
          <h3>Tipo de cancha</h3>
          <div className="contenedorTipoCancha">
            <div>
              <p>Fútbol 5</p>
              <input
                type="checkbox"
                id="futbol5"
                onChange={() => handleTipoCanchaChange("Fútbol 5")}
              />
              <div className="custom-checkbox"></div> {/* Checkbox personalizado */}
            </div>
            <div>
              <p>Fútbol 8</p>
              <input
                type="checkbox"
                id="futbol8"
                onChange={() => handleTipoCanchaChange("Fútbol 8")}
              />
              <div className="custom-checkbox"></div> {/* Checkbox personalizado */}
            </div>
            <div>
              <p>Fútbol 11</p>
              <input
                type="checkbox"
                id="futbol11"
                onChange={() => handleTipoCanchaChange("Fútbol 11")}
              />
              <div className="custom-checkbox"></div> {/* Checkbox personalizado */}
            </div>
          </div>
        </section>
      )}

      {filtrosSeleccionados.some((filtro) => filtro.value === "servicios") && (
        <section className="servicios">
          <h3>Servicios</h3>
          <div className="servicios-contenedor">
            {[
              "Arbitraje",
              "Petos",
              "Iluminación",
              "Balón",
              "Hidratación",
              "Cronómetro",
              "Vestuario",
              "Duchas",
              "Baños",
            ].map((servicio) => (
              <div key={servicio}>
                <input
                  type="checkbox"
                  id={`servicio-${servicio}`}
                  onChange={() => handleServicioChange(servicio)}
                  checked={selectedServicios.includes(servicio)}
                />
                <label htmlFor={`servicio-${servicio}`}>{servicio}</label>
              </div>
            ))}
          </div>
        </section>
      )}



      {/* Tarjetas de empresas */}
      <section className="empresas">
        <h3>Resultado busqueda </h3>
        <div className="lista-empresas">
          {allCompanies.length > 0 ? (
            allCompanies.map((empresa, index) => (
              <div key={index} className="tarjeta-empresa">
                <p>
                  {/* <strong>Empresa:</strong>  */}
                  {empresa.nombreEmpresa}
                </p>
                <button
                  className="btn-arrive"
                  onClick={() => {
                    const location = geocodedFields.find(
                      (field) => field.id_empresa === empresa.id
                    );
                    if (location) {
                      calcularRuta({ lat: location.lat, lng: location.lng });
                    } else {
                      alert("No se encontraron coordenadas para esta empresa.");
                    }
                  }}
                >
                  Cómo llegar
                </button>

              </div>
            ))
          ) : (
            <p>No hay empresas registradas.</p>
          )}
        </div>
      </section>

      {/* <NavLink className="return-filter" to='/HomeClient'>
          Volver
        </NavLink> */}
    </div>
  );
};

export default CardGps;
