import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';

const center = {
  lat: 4.5356, // Latitud de Armenia
  lng: -75.6894 // Longitud de Armenia
};

const mapContainerStyle = {
  height: '400px',
  width: '800px'
};

const options = {
  disableDefaultUI: true,
  zoomControl: true
};

function MapComponent() {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [searchBox, setSearchBox] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [location, setLocation] = useState(center);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
    libraries: ['places']
  });

  useEffect(() => {
    // Fetch canchas from the backend
    axios.get('/admin/find-all')
        .then(response => {
          const canchas = response.data;
          const markers = canchas.map(c => ({
            address: c.direccionEmpresa,
            name: c.nombreEmpresa,
            lat: 0,
            lng: 0
          }));
          setMarkers(markers);
          // Geocode addresses
          Promise.all(markers.map(marker => geocodeAddress(marker.address)))
              .then(results => {
                setSearchResults(results);
              });
        })
        .catch(error => {
          console.error('Error fetching canchas:', error);
        });
  }, []);

  const geocodeAddress = (address) => {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: address,
        key: 'YOUR_GOOGLE_MAPS_API_KEY'
      }
    }).then(response => {
      const location = response.data.results[0]?.geometry?.location;
      return {
        address: address,
        lat: location.lat,
        lng: location.lng
      };
    }).catch(error => {
      console.error('Error geocoding address:', error);
      return {
        address: address,
        lat: 0,
        lng: 0
      };
    });
  };

  const handlePlacesChanged = () => {
    const places = searchBox.getPlaces();
    if (places.length === 0) return;

    const place = places[0];
    const newLocation = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };
    setLocation(newLocation);
    map.panTo(newLocation);
    map.setZoom(15);
  };

  return (
      <div>
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY" libraries={['places']}>
          <StandaloneSearchBox
              onLoad={ref => setSearchBox(ref)}
              onPlacesChanged={handlePlacesChanged}
          >
            <input
                type="text"
                placeholder="Buscar ubicación"
                style={{ boxSizing: `border-box`, border: `1px solid transparent`, width: `240px`, height: `40px`, padding: `0 12px`, borderRadius: `3px`, fontSize: `14px`, outline: `none`, textOverflow: `ellipses` }}
            />
          </StandaloneSearchBox>
          <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={location}
              zoom={12}
              options={options}
              onLoad={map => setMap(map)}
          >
            {searchResults.map((marker, index) => (
                <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
  );
}

export default MapComponent;
