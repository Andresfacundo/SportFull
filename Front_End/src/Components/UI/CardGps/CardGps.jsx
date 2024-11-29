import React, { useState, useEffect } from "react";
import Select from "react-select";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import "./CardGps.css";

// Icono personalizado para Leaflet
const icon = new L.Icon({
  iconUrl: "src/assets/Images/icons/icon-ball.png",
  iconSize: [55, 80],
  iconAnchor: [25, 90],
  popupAnchor: [-3, -76],
});


// Componente para centrar el mapa dinámicamente
const SetViewOnClick = ({ center }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

const CardGps = () => {
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
          setUbicacionActual({
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
        const dataCompany = response.data; // Toda la data de empresas
        setAllUbic(dataCompany); // Almacena todas las ubicaciones pero no las muestra aún

        // Extraer todas las canchas
        const allFields = dataCompany.flatMap((empresa) =>
          empresa.fields.map((field) => ({
            ...field,
            id_empresa: empresa.id,
            direccionEmpresa: empresa.direccionEmpresa,
            nombreEmpresa: empresa.nombreEmpresa,
          }))
        );

        console.log("Todas las canchas:", allFields); // Imprime las canchas

        geocodeFields(allFields); // Geocodifica, pero no asigna directamente a geocodedFields
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
    const ubicacionesFiltradas = aplicarFiltros();

    if (ubicacionesFiltradas.length > 0) {
      setFilteredLocations(ubicacionesFiltradas); // Actualiza el estado con los resultados
      setUbicacionActual({
        lat: ubicacionesFiltradas[0].lat,
        lng: ubicacionesFiltradas[0].lng,
      });
    } else {
      alert("No se encontró ninguna ubicación con los filtros aplicados.");
      setFilteredLocations([]); // Deja el mapa vacío si no hay resultados
    }
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
                ubicacion.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
                ubicacion.direccion?.toLowerCase().includes(busqueda.toLowerCase())
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
              const fields = Array.isArray(ubicacion.fields) ? ubicacion.fields : [ubicacion.fields];
              return fields.some((field) => selectedTiposCancha.includes(field.tipoCancha));
            });
          }
          break;
        case "servicios":
          // Lógica para filtrar por servicios
          break;
        default:
          break;
      }
    });

    return resultado;
  };



  const geocodeFields = async (fields) => {
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
              fields: field,
            };
          }
          return null;
        } catch (error) {
          console.error(`Error en la geocodificación: `, error);
          return null;
        }
      })
    );

    setAllUbic(newLocations.filter((location) => location !== null));
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
    setSelectedTiposCancha((prevTipos) =>
      prevTipos.includes(tipo)
        ? prevTipos.filter((t) => t !== tipo) // Si ya está, lo elimina
        : [...prevTipos, tipo] // Si no está, lo agrega
    );
  };



  const handleFilterChange = (selectedOptions) => {
    setFiltrosSeleccionados(selectedOptions || []);
  };

  return (
    <div className="cardGps">
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
      </div>

      {/* Secciones dinámicas basadas en filtros */}
      {filtrosSeleccionados.some((filtro) => filtro.value === "precio") && (
        <section className="precio">
          <h3>Precio</h3>
          <div className="precio-contenedor">
            <input
              type="number"
              placeholder="min"
              value={precioMin || ""}
              onChange={(e) => {
                const value = e.target.value ? parseFloat(e.target.value) : null;
                setPrecioMin(value >= 0 ? value : null); // Validar valores positivos
              }}
            />
            <p> - </p>
            <input
              type="number"
              placeholder="max"
              value={precioMax || ""}
              onChange={(e) => {
                const value = e.target.value ? parseFloat(e.target.value) : null;
                setPrecioMax(value >= 0 ? value : null); // Validar valores positivos
              }}
            />
          </div>
        </section>
      )}

      {filtrosSeleccionados.some((filtro) => filtro.value === "ubicacion") && (
        <section className="ubicacion">
          <h3>Ubicación</h3>
          <input type="text" placeholder="Dirección" value={busqueda} onChange={handleBusquedaChange} />
        </section>
      )}

      {filtrosSeleccionados.some((filtro) => filtro.value === "disponibilidad") && (
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
      )}

      {filtrosSeleccionados.some((filtro) => filtro.value === "tipoCancha") && (
        <section className="tipoCancha">
          <h3>Tipo de cancha</h3>
          <div className="contenedorTipoCancha">
            <div>
              <p>Fútbol 5</p>
              <input
                type="checkbox"
                onChange={() => handleTipoCanchaChange("Fútbol 5")}
              />
            </div>
            <div>
              <p>Fútbol 8</p>
              <input
                type="checkbox"
                onChange={() => handleTipoCanchaChange("Fútbol 8")}
              />
            </div>
            <div>
              <p>Fútbol 11</p>
              <input
                type="checkbox"
                onChange={() => handleTipoCanchaChange("Fútbol 11")}
              />
            </div>
          </div>

        </section>
      )}

      {filtrosSeleccionados.some((filtro) => filtro.value === "servicios") && (
        <section className="servicios">
          <h3>Servicios</h3>
          <div className="servicios-contenedor">
            <input type="checkbox" /> <label>Arbitraje</label>
            <input type="checkbox" /> <label>Petos</label>
            <input type="checkbox" /> <label>Iluminación</label>
            <input type="checkbox" /> <label>Balón</label>
            <input type="checkbox" /> <label>Hidratación</label>
            <input type="checkbox" /> <label>Cronómetro</label>
            <input type="checkbox" /> <label>Vestuario</label>
            <input type="checkbox" /> <label>Duchas</label>
            <input type="checkbox" /> <label>Baños</label>
          </div>
        </section>
      )}

      <button onClick={handleBusquedaClick}>Buscar</button>
    </div>
  );
};

export default CardGps;
