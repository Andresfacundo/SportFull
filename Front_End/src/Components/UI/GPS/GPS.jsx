// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";

const MapaConGPS = () => {
    const [ubicacionActual, setUbicacionActual] = useState({
        lat: 4.533889, // Latitud predeterminada de Armenia, Quindío
        lng: -75.681389, // Longitud predeterminada de Armenia, Quindío
    });
    const [direcciones, setDirecciones] = useState([]); // Para almacenar las direcciones de las empresas
    const [geocodedLocations, setGeocodedLocations] = useState([]); // Para almacenar las coordenadas de las direcciones

    // Opciones para limitar el área de navegación
    const restriccionesMapa = {
        restriction: {
            latLngBounds: {
                north: 4.637, // Limites norte de Armenia
                south: 4.423, // Limites sur de Armenia
                west: -75.774, // Limites oeste de Armenia
                east: -75.588, // Limites este de Armenia
            },
            strictBounds: true,
        },
    };

    // Opciones del mapa
    const opcionesMapa = {
        zoom: 14,
        mapTypeId: "roadmap",
        ...restriccionesMapa,
    };

    // Al montar el componente, obtenemos la ubicación actual y las direcciones
    useEffect(() => {
        // Obtener la ubicación actual del usuario
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

        // Obtener las direcciones de las empresas desde el backend
        axios.get("http://localhost:8080/admin/find-all")
            .then((response) => {
                setDirecciones(response.data.map((empresa) => empresa.direccionEmpresa));
            })
            .catch((error) => {
                console.error("Error al obtener las direcciones: ", error);
            });
    }, []);

    // Convertir direcciones a coordenadas (geocodificación)
    useEffect(() => {
        const geocodeAddresses = async () => {
            const geocoder = new window.google.maps.Geocoder();
            const newLocations = await Promise.all(direcciones.map((direccion) => {
                return new Promise((resolve) => {
                    geocoder.geocode({ address: direccion }, (results, status) => {
                        if (status === "OK" && results[0]) {
                            resolve({ lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() });
                        } else {
                            resolve(null); // Si no se puede geocodificar la dirección
                        }
                    });
                });
            }));
            setGeocodedLocations(newLocations.filter((location) => location !== null));
        };

        if (direcciones.length > 0) {
            geocodeAddresses();
        }
    }, [direcciones]);

    return (
        <LoadScript googleMapsApiKey="AIzaSyAwG4iRanUdSFjqS5wbyjDachLL4fqE9NM">
            <GoogleMap
                mapContainerStyle={{ height: "400px", width: "100%" }}
                center={ubicacionActual}
                options={opcionesMapa}
            >
                {geocodedLocations.map((location, index) => (
                    <Marker key={index} position={location} />
                ))}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapaConGPS;
