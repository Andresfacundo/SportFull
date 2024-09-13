import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";

const MapaConGPS = () => {
  const [ubicacionActual, setUbicacionActual] = useState({
    lat: 4.533889, // Latitud predeterminada de Armenia, Quindío
    lng: -75.681389, // Longitud predeterminada de Armenia, Quindío
  });
  const [geocodedFields, setGeocodedFields] = useState([]); // Para las coordenadas de las canchas
  const [searchQuery, setSearchQuery] = useState(""); // Para almacenar el término de búsqueda

  const opcionesMapa = {
    zoom: 14,
    mapTypeId: "roadmap",
    restriction: {
      latLngBounds: {
        north: 4.637, // Limite norte de Armenia
        south: 4.423, // Limite sur de Armenia
        west: -75.774, // Limite oeste de Armenia
        east: -75.588, // Limite este de Armenia
      },
      strictBounds: true,
    },
  };

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

  useEffect(() => {
    if (searchQuery) {
      axios.get(`http://localhost:8080/fields/search?nombre=${searchQuery}`)
        .then((response) => {
          const fields = response.data;
          geocodeFields(fields);
        })
        .catch((error) => {
          console.error("Error al buscar las canchas: ", error);
        });
    }
  }, [searchQuery]);

  const geocodeFields = async (fields) => {
    const newLocations = await Promise.all(fields.map(async (field) => {
      try {
        const direccionEmpresa = field.adminModels.direccionEmpresa; // Obtener dirección desde AdminModels

        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json`,
          {
            params: {
              address: direccionEmpresa, // Usar la dirección de la empresa
              key: "TU_API_KEY_DE_GOOGLE_MAPS", 
              region: "CO",
            },
          }
        );

        if (response.data.status === "OK") {
          const location = response.data.results[0].geometry.location;
          return {
            lat: location.lat,
            lng: location.lng,
            nombre: field.nombre,
          };
        } else {
          console.error(`Error de geocodificación: ${response.data.status}`);
          return null;
        }
      } catch (error) {
        console.error(`Error en la geocodificación de ${direccionEmpresa}: `, error);
        return null;
      }
    }));

    setGeocodedFields(newLocations.filter((location) => location !== null));
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
      <LoadScript googleMapsApiKey="TU_API_KEY_DE_GOOGLE_MAPS">
        <GoogleMap
          mapContainerStyle={{ height: "400px", width: "100%" }}
          center={ubicacionActual}
          options={opcionesMapa}
        >
          {geocodedFields.map((location, index) => (
            <Marker key={index} position={location} label={location.nombre} />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapaConGPS;
