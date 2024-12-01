import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Define las rutas y los íconos
  const items = [
    { icon: 'home-outline', route: '/HomeClient' },
    { icon: 'person-outline', route: '/ActualizarCliente' },
    { icon: 'football-outline', route: '/SearchFields' },
    { icon: 'send-outline', route: '/Soporte' },
    { icon: 'eye-outline', route: '/HistorialCliente' },
  ];

  // Actualiza el índice activo según la ruta actual
  useEffect(() => {
    const currentIndex = items.findIndex((item) => item.route === location.pathname);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname, items]);

  // Maneja el clic y redirige
  const handleClick = (index) => {
    setActiveIndex(index);
    navigate(items[index].route);
  };

  return (
    <div className='navigation'>
      <ul>
        {items.map((item, index) => (
          <li
            key={index}
            className={`list ${activeIndex === index ? 'active' : ''}`}
            onClick={() => handleClick(index)}
          >
            <a className='a_navbar' href='#'>
              <span className='icon'>
                <ion-icon name={item.icon}></ion-icon>
              </span>
              <span className='text'>{item.route.replace('/', '')}</span>
            </a>
          </li>
        ))}
        <div className='indicator'></div>
      </ul>
    </div>
  );
};

export default NavBar;
