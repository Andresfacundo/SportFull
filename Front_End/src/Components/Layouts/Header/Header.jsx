import './Header.css';
import React, { useEffect, useState } from 'react';
import icon_logout from '../../../../src/assets/Images/icons/salida.png';
import icon_reservation from '../../../../src/assets/Images/icons/Icon_Reservation.png';
import icon_notification from '../../../../src/assets/Images/icons/icon_notificacion.png';
import ClienteService from '../../../services/ClienteService';
import { CurrentDate } from '../../UI/CurrentDate/CurrentDate';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import imgGuest from '../../../assets/Images/Avatars/Perfil-Client.png';

export const Header = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Función para obtener datos del usuario autenticado
  const getUser = () => JSON.parse(localStorage.getItem('user'));

  // Estados
  const user = getUser();
  const [imageSrc, setImageSrc] = useState('');

  const handleEditProfile = () => navigate('/editprofile');
  const handleLogout = () => {
    ClienteService.logout();
    navigate('/Login');
  };

  // Formatear nombre y apellido
  const obtenerResultado = (nombre, apellido) => {
    const showNombre = nombre?.trim().split(' ')[0];
    const showApellido = apellido?.trim().split(' ')[0]?.[0];
    const nombreCapitalizado = showNombre?.charAt(0).toUpperCase() + showNombre?.slice(1).toLowerCase();
    const apellidoCapitalizado = showApellido?.toUpperCase();
    return `${nombreCapitalizado || 'Nombre'} ${apellidoCapitalizado || 'A'}.`;
  };

  const resultado = user 
    ? obtenerResultado(user?.nombres, user?.apellidos) 
    : 'Invitado';

  const validPaths = ['/ActualizarCliente', '/ActualizarEmpresa', '/ActualizarGestor'];
  const editIconClass = validPaths.includes(location.pathname) ? 'edit_icon show' : 'edit_icon hide';

  // Obtener imagen de perfil
  useEffect(() => {
    let objectUrl;
    if (user) {
      const imgPerfil = user.tipoUsuario === 'EMPRESA' 
        ? user.adminModels?.imgPerfil 
        : user.clientModels?.imgPerfil;

      if (Array.isArray(imgPerfil)) {
        const byteArray = new Uint8Array(imgPerfil);
        const blob = new Blob([byteArray], { type: 'image/jpg' });
        objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
      } else if (typeof imgPerfil === 'string') {
        setImageSrc(`data:image/jpg;base64,${imgPerfil}`);
      } else {
        setImageSrc(imgGuest);
      }
    } else {
      setImageSrc(imgGuest); // Usuario no autenticado (Invitado)
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl); // Limpiar memoria
      }
    };
  }, [user]);

  // Si el usuario no está autenticado, mostrar diseño de invitado
  if (!user) {
    return (
      <header className='header_home guest-mode'>
        <div className='container_header'>
          <div className='container_options'>
            <CurrentDate />
          </div>
          <div className='container_user'>
            <div className='container_img_header'>
              <img className='img_manager' src={imgGuest} alt="Foto de perfil" />
            </div>
            <h2 className='nameUser'>Invitado</h2>
          </div>
        </div>
      </header>
    );
  }

  // Header normal para usuarios autenticados
  return (
    <header className='header_home'>
      <div className='container_header'>
        <div className='container_options'>
          <CurrentDate />
          <>
            <NavLink to='/PendingReservations' className={'configuration'}>
              <img className='icon_options' src={icon_reservation} alt="Configuración" />
            </NavLink>
            <NavLink className={'notifications'}>
              <img className='icon_options' src={icon_notification} alt="Notificaciones" />
            </NavLink>
            <NavLink to='/Login' onClick={handleLogout} className={'logout'}>
              <img className='icon_logout' src={icon_logout} alt="Cerrar sesión" />
            </NavLink>
          </>
        </div>

        <div className='container_user'>
          <div className='container_img'>
            <img className='img_manager' src={imageSrc} alt="Foto de perfil" />
          </div>
          <h2 className='nameUser'>{resultado}</h2>
        </div>

        <div className={editIconClass} onClick={handleEditProfile}>
          <FontAwesomeIcon icon={faPencilAlt} />
        </div>
      </div>
    </header>
  );
};
