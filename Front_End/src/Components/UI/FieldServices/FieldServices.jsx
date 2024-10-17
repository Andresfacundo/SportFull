// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "./FieldServices.css"; // Archivo de estilos

const servicesList = [
  "Petos",
  "Guallos",
  "Baños",
  "Duchas",
  "Iluminación",
  "Bebederos",
  "Estacionamiento",
  "Vestidores",
  "WiFi",
  "Graderías",
];

const Services = () => {
  const [showServices, setShowServices] = useState(false);
  const [services, setServices] = useState(servicesList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false); // Estado para añadir servicios
  const [newService, setNewService] = useState("");

  const toggleServices = () => {
    setShowServices(!showServices);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = (e) => {
    if (e.target.className === "modal") {
      setIsModalOpen(false);
      setIsDeleteMode(false); // Desactivar modo eliminar al cerrar el modal
      setIsAddMode(false);    // Desactivar modo añadir al cerrar el modal
    }
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setIsAddMode(false); // Desactivar modo añadir si se activa modo eliminar
  };

  const toggleAddMode = () => {
    setIsAddMode(!isAddMode);
    setIsDeleteMode(false); // Desactivar modo eliminar si se activa modo añadir
  };

  const handleDelete = (service) => {
    if (isDeleteMode) {
      setServices(services.filter((s) => s !== service));
    }
  };

  const handleAddService = () => {
    if (newService && newService.length <= 12) {
      setServices([...services, newService]);
      setNewService(""); // Limpiar el input después de añadir
    }
  };

  return (
    <div className="services-container">
      <button onClick={toggleServices} className="toggle-button">
        Servicios
      </button>
      {showServices && (
        <div className="services-list">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-item"
            >
              {service}
            </div>
          ))}
          <button onClick={openModal} className="add-button">+</button>
        </div>
      )}
      
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <button onClick={toggleDeleteMode} className="delete-button">
              {isDeleteMode ? "Desactivar Eliminar" : "Eliminar"}
            </button>
            <button onClick={toggleAddMode} className="add-service-button">
              Añadir
            </button>
            
            {/* Mostrar el input solo si está en modo añadir */}
            {isAddMode && (
              <div>
                <input
                  type="text"
                  maxLength="12"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="Nuevo Servicio"
                />
                <button onClick={handleAddService} className="add-service-submit">
                  Añadir Servicio
                </button>
              </div>
            )}

            <div className="modal-services-list">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="modal-service-item"
                  onClick={() => handleDelete(service)} // Hacer clic para eliminar servicio
                  style={{ cursor: isDeleteMode ? 'pointer' : 'default', color: isDeleteMode ? 'red' : 'black' }}
                >
                  {service}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
