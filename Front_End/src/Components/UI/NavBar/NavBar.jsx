import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleIndex, setVisibleIndex] = useState(null); // Índice del nombre visible temporalmente
  const navigate = useNavigate();
  const location = useLocation();

  // Define las rutas, íconos y nombres personalizados
  const items = [
    { icon: 'home-outline', route: '/HomeClient', name: 'Inicio' },
    { icon: 'person-outline', route: '/ActualizarCliente', name: 'Perfil' },
    { icon: 'football-outline', route: '/SearchFields', name: 'Canchas' },
    { icon: 'send-outline', route: '/Soporte', name: 'Soporte' },
    { icon: 'eye-outline', route: '/HistorialCliente', name: 'Historial' },
  ];

  // Actualiza el índice activo según la ruta actual
  useEffect(() => {
    const currentIndex = items.findIndex((item) => item.route === location.pathname);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname, items]);

  // Maneja el clic, muestra el nombre temporalmente y redirige
  const handleClick = (index) => {
    setActiveIndex(index);
    setVisibleIndex(index); // Muestra el nombre
    setTimeout(() => setVisibleIndex(null), 2000); // Oculta el nombre después de 2 segundos
    navigate(items[index].route);
  };

  return (
    <div className="navigation">
      <ul>
        {items.map((item, index) => (
          <li
            key={index}
            className={`list ${activeIndex === index ? 'active' : ''}`}
            onClick={() => handleClick(index)}
          >
            <div className="nav-item">
              {visibleIndex === index && (
                <span className="name-popup">{item.name}</span>
              )}
              <span className="icon">
                <ion-icon name={item.icon}></ion-icon>
              </span>
            </div>
          </li>
        ))}
        <div className="indicator"></div>
      </ul>
    </div>
  );
};

export default NavBar;
