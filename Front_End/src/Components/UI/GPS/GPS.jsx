// // eslint-disable-next-line no-unused-vars
// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import axios from "axios";
// import L from "leaflet";
// import PropTypes from "prop-types";


// // Icono personalizado para los marcadores
// const icon = new L.Icon({
//   iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
//   iconSize: [38, 95],
//   iconAnchor: [22, 94],
//   popupAnchor: [-3, -76],
// });

// // Componente para centrar el mapa en una nueva ubicación
// // eslint-disable-next-line react/prop-types
// const SetViewOnClick = ({ center }) => {
//   const map = useMap();
//   map.setView(center, map.getZoom());
//   return null;
// };

// const MapaConGPS = () => {
//   const [ubicacionActual, setUbicacionActual] = useState({
//     lat: 4.533889, // Latitud predeterminada de Armenia, Quindío
//     lng: -75.681389, // Longitud predeterminada de Armenia, Quindío
//   });
//   const [geocodedFields, setGeocodedFields] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [allUbic, setAllUbic] = useState([]);
//   const [mostrarTodas, setMostrarTodas] = useState(false);

//   // Obtener la ubicación actual del usuario
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUbicacionActual({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         () => {
//           console.log("Error obteniendo ubicación. Cargando Armenia.");
//         }
//       );
//     }
//   }, []);

//   // Obtener todas las ubicaciones del backend al cargar la página
//   useEffect(() => {
//     axios
//       .get(`http://localhost:8080/admin/find-all`)
//       .then((response) => {
//         const fields = response.data;
//         setAllUbic(fields);
//       })
//       .catch((error) => {
//         console.error("Error al buscar las ubicaciones: ", error);
//       });
//   }, []);

//   // Buscar ubicaciones basadas en el término de búsqueda
//   useEffect(() => {
//     if (!searchQuery.trim()) {
//       setGeocodedFields([]);
//       return;
//     }

//     const filteredFields = allUbic.filter(
//       (field) =>
//         field &&
//         field.nombreEmpresa &&
//         field.nombreEmpresa.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     if (filteredFields.length > 0) {
//       geocodeFields(filteredFields, true);
//     } else {
//       setGeocodedFields([]);
//     }
//   }, [searchQuery, allUbic]);

//   // Llamar a la API de Geocoding de Nominatim para convertir las direcciones en coordenadas
//   const geocodeFields = async (fields, centerOnFirst = false) => {
//     const newLocations = await Promise.all(
//       fields.map(async (field) => {
//         try {
//           const response = await axios.get(
//             `https://nominatim.openstreetmap.org/search`,
//             {
//               params: {
//                 q: field.direccionEmpresa,
//                 format: "json",
//                 addressdetails: 1,
//                 limit: 1,
//                 countrycodes: "CO", // Restringido a Colombia
//               },
//             }
//           );

//           if (response.data.length > 0) {
//             const location = response.data[0];
//             return {
//               lat: parseFloat(location.lat),
//               lng: parseFloat(location.lon),
//               nombre: field.nombreEmpresa,
//             };
//           } else {
//             console.error(`Error de geocodificación: No se encontró ubicación para ${field.direccionEmpresa}`);
//             return null;
//           }
//         } catch (error) {
//           console.error(`Error en la geocodificación de ${field.direccionEmpresa}: `, error);
//           return null;
//         }
//       })
//     );

//     const filteredLocations = newLocations.filter((location) => location !== null);
//     setGeocodedFields(filteredLocations);

//     if (centerOnFirst && filteredLocations.length > 0) {
//       setUbicacionActual(filteredLocations[0]);
//     }
//   };

//   // Función para mostrar/ocultar todas las canchas
//   const toggleMostrarTodasLasCanchas = () => {
//     if (mostrarTodas) {
//       setGeocodedFields([]);
//     } else {
//       geocodeFields(allUbic);
//     }
//     setMostrarTodas(!mostrarTodas);
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Buscar cancha"
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         style={{ marginBottom: "10px", padding: "5px", width: "300px" }}
//       />
//       <button onClick={toggleMostrarTodasLasCanchas} style={{ marginLeft: "10px" }}>
//         {mostrarTodas ? "Ocultar todas las canchas" : "Mostrar todas las canchas"}
//       </button>
//       <MapContainer
//         center={ubicacionActual}
//         zoom={14}
//         scrollWheelZoom={false}
//         style={{ height: "400px", width: "100%", marginTop: "20px" }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//         <SetViewOnClick center={ubicacionActual} />
//         {geocodedFields.length > 0 ? (
//           geocodedFields.map((location, index) => (
//             <Marker key={index} position={[location.lat, location.lng]} icon={icon}>
//               <Popup>{location.nombre}</Popup>
//             </Marker>
//           ))
//         ) : (
//           <p>No se encontraron canchas.</p>
//         )}
//       </MapContainer>
//     </div>
//   );
// };

// // Validar las props del componente
// MapaConGPS.propTypes = {
//   center: PropTypes.shape({
//     lat: PropTypes.number.isRequired,
//     lng: PropTypes.number.isRequired,
//   }).isRequired,
// };

// export default MapaConGPS;


// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import PropTypes from "prop-types";

// Icono personalizado para los marcadores
const icon = new L.Icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
  iconSize: [38, 95],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

// Componente para centrar el mapa en una nueva ubicación
// eslint-disable-next-line react/prop-types
const SetViewOnClick = ({ center }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

const MapaConGPS = () => {
  const [ubicacionActual, setUbicacionActual] = useState({
    lat: 4.533889, // Latitud predeterminada de Armenia, Quindío
    lng: -75.681389, // Longitud predeterminada de Armenia, Quindío
  });
  const [geocodedFields, setGeocodedFields] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allUbic, setAllUbic] = useState([]);
  const [mostrarTodas, setMostrarTodas] = useState(false);

  // Estado para almacenar los datos de las canchas
  const [fields, setFields] = useState([]);

  // Obtener la ubicación actual del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUbicacionActual({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log("Error obteniendo ubicación. Cargando Armenia.");
        }
      );
    }
  }, []);

  // Obtener todas las ubicaciones del backend al cargar la página
  useEffect(() => {
    axios
      .get(`http://localhost:8080/admin/find-all`)
      .then((response) => {
        const ubic = response.data;
        setAllUbic(ubic);
      })
      .catch((error) => {
        console.error("Error al buscar las ubicaciones: ", error);
      });
  }, []);

  // Obtener todas las canchas del backend al cargar la página
  useEffect(() => {
    axios
      .get(`http://localhost:8080/fields/findAll`)
      .then((response) => {
        setFields(response.data);
        console.log("Datos de canchas obtenidos:", response.data);
      })
      .catch((error) => {
        console.error("Error al buscar las canchas: ", error);
      });
  }, []);

  // Buscar ubicaciones basadas en el término de búsqueda
  useEffect(() => {
    if (!searchQuery.trim()) {
      setGeocodedFields([]);
      return;
    }

    const filteredFields = allUbic.filter(
      (field) =>
        field &&
        field.nombreEmpresa &&
        field.nombreEmpresa.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredFields.length > 0) {
      geocodeFields(filteredFields, true);
    } else {
      setGeocodedFields([]);
    }
  }, [searchQuery, allUbic]);

  // Llamar a la API de Geocoding de Nominatim para convertir las direcciones en coordenadas
  const geocodeFields = async (fields, centerOnFirst = false) => {
    const newLocations = await Promise.all(
      fields.map(async (field) => {
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/search`,
            {
              params: {
                q: field.direccionEmpresa,
                format: "json",
                addressdetails: 1,
                limit: 1,
                countrycodes: "CO", // Restringido a Colombia
              },
            }
          );

          if (response.data.length > 0) {
            const location = response.data[0];
            return {
              lat: parseFloat(location.lat),
              lng: parseFloat(location.lon),
              nombre: field.nombreEmpresa,
            };
          } else {
            console.error(`Error de geocodificación: No se encontró ubicación para ${field.direccionEmpresa}`);
            return null;
          }
        } catch (error) {
          console.error(`Error en la geocodificación de ${field.direccionEmpresa}: `, error);
          return null;
        }
      })
    );

    const filteredLocations = newLocations.filter((location) => location !== null);
    setGeocodedFields(filteredLocations);

    if (centerOnFirst && filteredLocations.length > 0) {
      setUbicacionActual(filteredLocations[0]);
    }
  };

  // Función para mostrar/ocultar todas las canchas
  const toggleMostrarTodasLasCanchas = () => {
    if (mostrarTodas) {
      setGeocodedFields([]);
    } else {
      geocodeFields(allUbic);
    }
    setMostrarTodas(!mostrarTodas);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar cancha"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "300px" }}
      />
      <button onClick={toggleMostrarTodasLasCanchas} style={{ marginLeft: "10px" }}>
        {mostrarTodas ? "Ocultar todas las canchas" : "Mostrar todas las canchas"}
      </button>
      <MapContainer
        center={ubicacionActual}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "400px", width: "100%", marginTop: "20px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <SetViewOnClick center={ubicacionActual} />
        {geocodedFields.length > 0 ? (
          geocodedFields.map((location, index) => (
            <Marker key={index} position={[location.lat, location.lng]} icon={icon}>
              <Popup>{location.nombre}</Popup>
            </Marker>
          ))
        ) : (
          <p>No se encontraron canchas.</p>
        )}
      </MapContainer>
    </div>
  );
};

// Validar las props del componente
MapaConGPS.propTypes = {
  center: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
};

export default MapaConGPS;
