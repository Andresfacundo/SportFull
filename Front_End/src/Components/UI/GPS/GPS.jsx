import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";

const MapaConGPS = () => {
  const [ubicacionActual, setUbicacionActual] = useState({
    lat: 4.533889, // Latitud predeterminada de Armenia, Quindío
    lng: -75.681389, // Longitud predeterminada de Armenia, Quindío
  });
  const [geocodedFields, setGeocodedFields] = useState([]); // Coordenadas de las canchas para los marcadores
  const [searchQuery, setSearchQuery] = useState(""); // Para almacenar el término de búsqueda
  const [allFields, setAllFields] = useState([]); // Almacenar todas las canchas
  const [mostrarTodas, setMostrarTodas] = useState(false); // Controlar si se muestran todas las canchas

  const opcionesMapa = {
    zoom: 14,
    mapTypeId: "roadmap",
    restriction: {
      latLngBounds: {
        north: 4.637, // Limite norte de Armenia
        south: 4.467662589827867, // Limite sur de Armenia
        west: -75.774, // Limite oeste de Armenia
        east: -75.588, // Limite este de Armenia
      },
      strictBounds: true, // Evita salir de los límites de Armenia
    },
  };

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

  // Obtener todas las canchas del backend al cargar la página
  useEffect(() => {
    axios
      .get(`http://localhost:8080/admin/find-all`)
      .then((response) => {
        const fields = response.data;
        setAllFields(fields); // Guardar todas las canchas
      })
      .catch((error) => {
        console.error("Error al buscar las canchas: ", error);
      });
  }, []);

  // Buscar canchas basadas en el término de búsqueda
  useEffect(() => {
    if (!searchQuery.trim()) {
      // Si el input está vacío, limpiar los marcadores inmediatamente
      setGeocodedFields([]);
      return;
    }

    const filteredFields = allFields.filter(
      (field) =>
        field &&
        field.nombreEmpresa &&
        field.nombreEmpresa.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredFields.length > 0) {
      geocodeFields(filteredFields, true); // Centrar el mapa en el primer resultado
    } else {
      setGeocodedFields([]); // No mostrar marcadores si no hay coincidencias
    }
  }, [searchQuery, allFields]);

  // Llamar a la API de Geocoding de Google para convertir las direcciones en coordenadas
  const geocodeFields = async (fields, centerOnFirst = false) => {
    const newLocations = await Promise.all(
      fields.map(async (field) => {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json`,
            {
              params: {
                address: field.direccionEmpresa,
                key: "AIzaSyAwG4iRanUdSFjqS5wbyjDachLL4fqE9NM", // Reemplaza con tu API key
                region: "CO", // Restricción regional (Colombia)
              },
            }
          );

          if (response.data.status === "OK") {
            const location = response.data.results[0].geometry.location;
            return {
              lat: location.lat,
              lng: location.lng,
              nombre: field.nombreEmpresa,
            };
          } else {
            console.error(`Error de geocodificación: ${response.data.status}`);
            return null;
          }
        } catch (error) {
          console.error(
            `Error en la geocodificación de ${field.direccionEmpresa}: `,
            error
          );
          return null;
        }
      })
    );

    const filteredLocations = newLocations.filter((location) => location !== null);
    setGeocodedFields(filteredLocations);

    if (centerOnFirst && filteredLocations.length > 0) {
      setUbicacionActual(filteredLocations[0]); // Centrar el mapa en el primer resultado
    }
  };

  // Función para mostrar/ocultar todas las canchas
  const toggleMostrarTodasLasCanchas = () => {
    if (mostrarTodas) {
      setGeocodedFields([]); // Ocultar todas las canchas
    } else {
      geocodeFields(allFields); // Mostrar todas las canchas
    }
    setMostrarTodas(!mostrarTodas); // Cambiar el estado de mostrarTodas
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
      <button
        onClick={toggleMostrarTodasLasCanchas}
        style={{ marginLeft: "10px" }}
      >
        {mostrarTodas ? "Ocultar todas las canchas" : "Mostrar todas las canchas"}
      </button>
      <LoadScript googleMapsApiKey="AIzaSyAwG4iRanUdSFjqS5wbyjDachLL4fqE9NM">
        <GoogleMap
          mapContainerStyle={{ height: "400px", width: "100%" }}
          center={ubicacionActual}
          options={opcionesMapa}
        >
          {geocodedFields.length > 0 ? (
            geocodedFields.map((location, index) => (
              <Marker key={index} position={location} label={location.nombre} />
            ))
          ) : (
            <p>No se encontraron canchas.</p>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapaConGPS;
