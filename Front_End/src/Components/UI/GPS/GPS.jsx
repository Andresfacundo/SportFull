// eslint-disable-next-line no-unused-vars
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
    const [searchResults, setSearchResults] = useState([]); // Para almacenar los resultados de la búsqueda

    const opcionesMapa = {
        zoom: 14,
        mapTypeId: "roadmap",
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

    // Realizar la búsqueda de canchas en el backend cuando cambia el término de búsqueda
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
        } else {
            setSearchResults([]); // Limpiar los resultados si no hay búsqueda
        }
    }, [searchQuery]);

    // Convertir las ubicaciones de las canchas en coordenadas usando Geocoding
    const geocodeFields = async (fields) => {
        const geocoder = new window.google.maps.Geocoder();
        const newLocations = await Promise.all(fields.map((field) => {
            return new Promise((resolve) => {
                geocoder.geocode({ address: field.ubicacion }, (results, status) => {
                    if (status === "OK" && results[0]) {
                        resolve({
                            lat: results[0].geometry.location.lat(),
                            lng: results[0].geometry.location.lng(),
                            nombre: field.nombre,
                        });
                    } else {
                        resolve(null); // Si no se puede geocodificar la ubicación
                    }
                });
            });
        }));
        setGeocodedFields(newLocations.filter((location) => location !== null));
        setSearchResults(fields); // Actualizar los resultados de búsqueda
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

