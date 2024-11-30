import React, { useEffect, useState } from 'react';
import './AdvancedConfiguration.css';
import fondo_long from '../../../../src/assets/Images/fondos/fondo_long.png';
import { Header } from '../../../Components/Layouts/Header/Header';
import OptionMenuLeft from '../../../Components/UI/OptionMenuLeft/OptionMenuLeft';
import OptionMenuRight from '../../../Components/UI/OptionMenuRight/OptionMenuRight';
import icon_01 from '../../../assets/Images/icons/jugador_04.png';
import icon_02 from '../../../assets/Images/icons/jugador_03.png';
import icon_03 from '../../../assets/Images/icons/jugador_01.png';
import { NavLink, useNavigate } from 'react-router-dom';
import NavBar from '../../UI/NavBar/NavBar';

export const AdvancedConfiguration = () => {
  const backgroundStyle = {
    backgroundImage: `url(${fondo_long})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    width: '100%',
  };

  const [userType, setUserType] = useState(null);
  const navigate = useNavigate(); // Hook para navegar programáticamente

  // Obtener el tipo de usuario del localStorage al cargar el componente
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Obtener el usuario del localStorage
    const type = user.tipoUsuario; // Obtener el ID del usuario// O el método que utilices para obtener el tipo
    setUserType(type);
  }, []);

  // Función para manejar la navegación
  const handleNavigation = () => {
    if (userType === 'GESTOR') {
      navigate('/ActualizarGestor');
    } else if (userType === 'EMPRESA') {
      navigate('/ActualizarEmpresa');
    } else if (userType === 'CLIENTE') {
      navigate('/ActualizarCliente');
    } else {
      // Puedes manejar un caso por defecto aquí si es necesario
      console.error('Tipo de usuario no reconocido');
    }
  };

  return (
    <div style={backgroundStyle} className='container'>
      <Header />

      <main className='main_advancedUpdates'>
        <OptionMenuRight link={'/ChangePassword'} shade={'shade_password'} classNameImg={'icon_1'} icon={icon_01} content={'Contraseña'} />
        <OptionMenuLeft link={'/PaymentMethod'} shade={'shade_pay'} classNameImg={'icon_2'} icon={icon_02} content={'Metodo Pago'} />
        <OptionMenuRight link={'/StatusAccount'} shade={'shade_StatusAccount'} classNameImg={'icon_01'} icon={icon_01} content={'Estado de Cuenta'} />

        {/* Usamos un botón que navega dinámicamente según el tipo de usuario */}
        <button className='return' onClick={handleNavigation}>Volver</button>
      </main>
{/* 
      <footer>
        <NavBar/>
      </footer> */}
    </div>
  );
};
