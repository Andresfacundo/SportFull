import React, { useState } from 'react';
import './NavBar.css';

const NavBar = () => {
 
  const [activeIndex, setActiveIndex] = useState(0);

  
  const handleClick = (index) => {
    setActiveIndex(index);
  };

  
  const items = [
    { name: 'Home', icon: 'home-outline' },
    { name: 'Profile', icon: 'person-outline' },
    { name: 'Canchas', icon: 'football-outline' },
    { name: 'Messages', icon: 'send-outline' },
    { name: 'Reservas', icon: 'eye-outline' },
  ];

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
              <span className='text'>{item.name}</span>
            </a>
          </li>
        ))}
        <div className='indicator'></div>
      </ul>
    </div>
  );
};

export default NavBar;
